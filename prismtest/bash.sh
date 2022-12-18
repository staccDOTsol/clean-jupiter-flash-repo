while :
do
OUTPUT=$(ps aux | grep -cE "ts-node test.ts")

if (( OUTPUT > 7 )); then
    echo "ts-node is $OUTPUT"
	sleep 5
else
    echo "ts-node is not running"
	
    ts-node test.ts &
sleep 3
#    nohup python3.7 bit_pos.py &
#    nohup python3.7 der_pos.py &
#    nohup python3.7 mex_ords.py &
#    nohup python3.7 bit_ords.py &
#    nohup python3.7 der_ords.py &
#    nohup python3.7 market_maker.py &
fi

done
