#!/usr/bin/env python3
"""
Performance Test Runner
Runs comprehensive performance tests for AI services
"""

import sys
import time
import json
from pathlib import Path
import subprocess

def run_performance_tests():
    """Run all performance tests and generate report"""
    print("🚀 Starting AI Services Performance Tests")
    print("=" * 50)
    
    start_time = time.time()
    
    try:
        # Run pytest with performance tests
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/test_performance.py", 
            "-v", "--tb=short"
        ], capture_output=True, text=True, cwd=Path(__file__).parent)
        
        test_time = time.time() - start_time
        
        print("📊 Test Results:")
        print(result.stdout)
        
        if result.stderr:
            print("⚠️  Warnings/Errors:")
            print(result.stderr)
        
        # Generate performance report
        generate_performance_report(test_time, result.returncode == 0)
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return False

def generate_performance_report(test_time: float, success: bool):
    """Generate performance test report"""
    print("\n📈 Performance Test Report")
    print("=" * 50)
    
    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "test_duration_seconds": round(test_time, 2),
        "overall_status": "PASSED" if success else "FAILED",
        "targets": {
            "brand_recognition_accuracy": "≥80%",
            "category_classification_accuracy": "≥75%",
            "profitability_analysis_accuracy": "≥75%",
            "model_extraction_accuracy": "≥70%",
            "response_time_products": "<2 seconds",
            "response_time_palettes": "<5 seconds",
            "cache_speedup": "≥5x for products, ≥2x for palettes"
        },
        "improvements": [
            "✅ Enhanced brand recognition with regex patterns",
            "✅ Improved model extraction with specific patterns",
            "✅ Added misspelling and variation handling",
            "✅ Implemented caching for performance",
            "✅ Extended test coverage with 40+ products",
            "✅ Added performance monitoring endpoints"
        ]
    }
    
    print(f"⏱️  Test Duration: {report['test_duration_seconds']}s")
    print(f"📊 Overall Status: {report['overall_status']}")
    
    print("\n🎯 Performance Targets:")
    for target, requirement in report['targets'].items():
        print(f"   • {target}: {requirement}")
    
    print("\n🚀 Improvements Implemented:")
    for improvement in report['improvements']:
        print(f"   {improvement}")
    
    # Save report to file
    report_file = Path(__file__).parent / "performance_report.json"
    with open(report_file, "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n💾 Report saved to: {report_file}")
    
    if success:
        print("\n🎉 All performance tests PASSED!")
        print("✅ AI Services are ready for production use")
    else:
        print("\n❌ Some performance tests FAILED!")
        print("⚠️  Please review the test output above")

def main():
    """Main function"""
    success = run_performance_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()




















