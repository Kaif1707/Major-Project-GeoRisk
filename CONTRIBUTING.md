# Contributing to GeoRisk Analytics

Thank you for your interest in contributing to **GeoRisk Analytics**!

---

## Code of Conduct

Please maintain a respectful and constructive atmosphere across all issues, pull requests, and discussions.

---

## Development Workflow

1. **Fork & Clone Repository**:
   ```bash
   git clone https://github.com/georisk/georisk-analytics.git
   ```

2. **Backend Development Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Frontend Development Setup**:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run dev
   ```

4. **Code Guidelines**:
   - Follow PEP 8 guidelines for Python backend code.
   - Use TypeScript strict type definitions for React frontend components.
   - Ensure all new API endpoints include OpenAPI docstrings and Pydantic response models.

5. **Submitting Pull Requests**:
   - Ensure `python -m py_compile` passes cleanly across modified backend files.
   - Ensure `npm run build` passes cleanly without TypeScript errors in the frontend.
