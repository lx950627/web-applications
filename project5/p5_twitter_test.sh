#!/bin/bash

rm -rf ./output

echo "====== Testing part B results..."
echo "====== Running scala-shell..."
spark-shell -i topUsers.scala

echo "====== Validating results..."

[ $(grep -Rh 40981798 ./output | cut -d, -f 2 | tr -d '()') -eq 8569 ] || echo "ERROR: Case 1 failed"
[ $(grep -Rh 3359851 ./output | cut -d, -f 2 | tr -d '()') -eq 3905 ] || echo "ERROR: Case 2 failed"
[ $(grep -Rh 88323281 ./output | cut -d, -f 2 | tr -d '()') -eq 2315 ] || echo "ERROR: Case 3 failed"
[ $(grep -Rh 18742444 ./output | cut -d, -f 2 | tr -d '()') -eq 1585 ] || echo "ERROR: Case 4 failed"
[ $(grep -Rh 9451052 ./output | cut -d, -f 2 | tr -d '()') -eq 1184 ] || echo "ERROR: Case 5 failed"
[ $(grep -Rh 302847930 ./output | cut -d, -f 2 | tr -d '()') -eq 1182 ] || echo "ERROR: Case 6 failed"
[ $(grep -Rh 12925072 ./output | cut -d, -f 2 | tr -d '()') -eq 1002 ] || echo "ERROR: Case 7 failed"

[ $(ls -l output | grep part-* | rev | cut -d' ' -f1 | rev | sed -e 's/^/output\//' | xargs cat | wc -l) -eq 177 ] || echo "Total lines mismatch"

echo "====== Part B test passed!"