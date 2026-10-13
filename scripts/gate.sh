#!/usr/bin/env bash
# Launch gate: objective PASS/FAIL. Run: bash scripts/gate.sh
fail=0
step(){ echo; echo "== $1"; }
ok(){ echo "PASS: $1"; }
bad(){ echo "FAIL: $1"; fail=1; }

step "branch"
b=$(git branch --show-current)
[ "$b" != "main" ] && ok "on $b" || bad "on main, use a branch"

step "build"
if npm run build >/tmp/gate_build.log 2>&1; then ok "build"; else bad "build"; tail -n 15 /tmp/gate_build.log; fi

step "tests (npm run verify)"
if npm run verify >/tmp/gate_verify.log 2>&1; then ok "verify"; else bad "verify"; tail -n 15 /tmp/gate_verify.log; fi

step "audit (production deps, high and above)"
if npm audit --omit=dev --audit-level=high >/tmp/gate_audit.log 2>&1; then ok "audit"; else bad "audit"; tail -n 20 /tmp/gate_audit.log; fi

step "repo hygiene"
git check-ignore -q .env && ok ".env ignored" || bad ".env not ignored"
git ls-files --error-unmatch .env.example >/dev/null 2>&1 && ok ".env.example tracked" || bad ".env.example not tracked"
if git ls-files | grep -Eq '^\.env$|^\.env\.local$|^build_output'; then bad "env or build_output file tracked"; else ok "no env/build_output files tracked"; fi
leaks=$(git ls-files ':!package-lock.json' | xargs grep -IlE 'AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,}' 2>/dev/null)
if [ -n "$leaks" ]; then bad "possible secret in: $leaks"; else ok "no obvious secrets in tracked files"; fi

step "config"
if grep -Eq "Access-Control-Allow-Origin['\"]?, *['\"]\*['\"]" api/*.ts 2>/dev/null; then bad "CORS wildcard in api/"; else ok "no CORS wildcard"; fi
grep -q "Content-Security-Policy" vercel.json && ok "CSP present" || bad "CSP missing in vercel.json"
[ -f DEPLOY.md ] && ok "DEPLOY.md present" || bad "DEPLOY.md missing"

echo
if [ $fail -eq 0 ]; then echo "GATE: PASS"; else echo "GATE: FAIL"; fi
exit $fail
