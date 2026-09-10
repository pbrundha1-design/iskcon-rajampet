import importlib.util
import os
from pathlib import Path
script_path = Path(__file__).resolve()
root = script_path.parent
spec = importlib.util.spec_from_file_location('admin_server', root / 'admin_server.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
print('Rules:')
for rule in sorted(mod.app.url_map.iter_rules(), key=lambda r: (str(r), tuple(r.methods))):
    print(f'{rule} {rule.methods}')
