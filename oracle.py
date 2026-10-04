import json, sys
from decimal import Decimal
from babel import Locale
req = json.load(sys.stdin)
out = []
if req and req[0] == 'cats':
    for l in req[1:]:
        L = Locale.parse(l.replace('-', '_'))
        out.append({'cardinal': sorted(L.plural_form.tags | {'other'}), 'ordinal': sorted(L.ordinal_form.tags | {'other'})})
    json.dump(out, sys.stdout)
    sys.exit(0)
for loc, typ, text in req:
    L = Locale.parse(loc.replace('-', '_'))
    pf = L.plural_form if typ == 'cardinal' else L.ordinal_form
    out.append(pf(Decimal(text)) if typ == 'cardinal' else pf(int(text)))
json.dump(out, sys.stdout)
