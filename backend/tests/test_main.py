import pytest
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_app_import():
    """Test that the app can be imported successfully"""
    try:
        from main import app
        assert app is not None
        print("✅ App imported successfully")
    except Exception as e:
        pytest.fail(f"Failed to import app: {e}")

def test_basic_functionality():
    """Test basic app functionality without TestClient for now"""
    from main import app
    assert app is not None
    assert hasattr(app, 'routes')
    print("✅ Basic app functionality test passed")
