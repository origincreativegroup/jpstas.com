#!/usr/bin/env node

/**
 * API Testing Script
 * Tests all API endpoints to ensure they work correctly in both dev and production modes
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  development: {
    baseUrl: 'http://localhost:5173',
    timeout: 5000,
  },
  production: {
    baseUrl: 'https://jpstas.com',
    timeout: 10000,
  },
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  errors: [],
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: options.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test cases
const testCases = [
  {
    name: 'GET /api/content (legacy)',
    method: 'GET',
    path: '/api/content',
    expectedStatus: 200,
  },
  {
    name: 'GET /api/content?type=projects',
    method: 'GET',
    path: '/api/content?type=projects',
    expectedStatus: 200,
  },
  {
    name: 'GET /api/content?type=about',
    method: 'GET',
    path: '/api/content?type=about',
    expectedStatus: 200,
  },
  {
    name: 'GET /api/media',
    method: 'GET',
    path: '/api/media',
    expectedStatus: 200,
  },
  {
    name: 'POST /api/content (legacy)',
    method: 'POST',
    path: '/api/content',
    body: {
      type: 'test',
      data: { message: 'Test data' },
    },
    expectedStatus: 200,
  },
];

// Run a single test
async function runTest(testCase, environment) {
  const baseUrl = config[environment].baseUrl;
  const url = `${baseUrl}${testCase.path}`;
  
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`   URL: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(url, {
      method: testCase.method,
      body: testCase.body,
      timeout: config[environment].timeout,
    });
    const duration = Date.now() - startTime;
    
    if (response.status === testCase.expectedStatus) {
      console.log(`   ✅ PASSED (${response.status}) - ${duration}ms`);
      results.passed++;
      return true;
    } else {
      console.log(`   ❌ FAILED - Expected ${testCase.expectedStatus}, got ${response.status}`);
      results.failed++;
      results.errors.push({
        test: testCase.name,
        environment,
        expected: testCase.expectedStatus,
        actual: response.status,
        response: response.data,
      });
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR - ${error.message}`);
    results.failed++;
    results.errors.push({
      test: testCase.name,
      environment,
      error: error.message,
    });
    return false;
  }
}

// Run all tests for an environment
async function runEnvironmentTests(environment) {
  console.log(`\n🚀 Testing ${environment.toUpperCase()} environment`);
  console.log(`   Base URL: ${config[environment].baseUrl}`);
  
  for (const testCase of testCases) {
    await runTest(testCase, environment);
  }
}

// Main function
async function main() {
  console.log('🔍 API Testing Script');
  console.log('====================');
  
  const args = process.argv.slice(2);
  const environments = args.length > 0 ? args : ['development'];
  
  for (const env of environments) {
    if (!config[env]) {
      console.log(`❌ Unknown environment: ${env}`);
      console.log(`   Available: ${Object.keys(config).join(', ')}`);
      process.exit(1);
    }
  }
  
  for (const env of environments) {
    await runEnvironmentTests(env);
  }
  
  // Print summary
  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.test} (${error.environment})`);
      if (error.error) {
        console.log(`      Error: ${error.error}`);
      } else {
        console.log(`      Expected: ${error.expected}, Got: ${error.actual}`);
      }
    });
  }
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Run the tests
main().catch((error) => {
  console.error('❌ Test runner failed:', error.message);
  process.exit(1);
});
