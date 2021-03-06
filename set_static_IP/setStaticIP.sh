#!/bin/bash
_set_ip="192.168.1.107"



#check mask
_get_Mask="$(ifconfig eth0|grep "Mask:"| tail -1 | cut -d ':' -f 4 | cut -d ' ' -f 2)"
echo "$-----the subnet mask $_get_Mask"

_first_Mask=${_get_Mask%%.*}
_last3_Mask=${_get_Mask#*.}
_second_Mask=${_last3_Mask%%.*}
_last2_Mask=${_last3_Mask#*.}
_third_Mask=${_last2_Mask%.*}
_fourth_Mask=${_last2_Mask#*.}

echo "$_get_Mask -> $_first_Mask, $_second_Mask, $_third_Mask, $_fourth_Mask"
echo "third one is $_third_Mask" 

if [ "$_third_Mask" != "255" ] || [ "$_first_Mask" != "255" ] || [ "$_second_Mask" != "255" ] || [ "$_fourth_Mask" != "0" ];then
  echo "Mask is file,change the mask"
  sudo ifconfig eth0 netmask 255.255.255.0
fi


#check the ip
_get_ip="$(ifconfig eth0|grep "inet addr:"| tail -1 | cut -d ':' -f 2 | cut -d ' ' -f 1)"
echo "$-----the ip $_get_ip"

_first=${_get_ip%%.*}
_last3=${_get_ip#*.}
_second=${_last3%%.*}
_last2=${_last3#*.}
_third=${_last2%.*}
_fourth=${_last2#*.}


if [ ! $_third ];then
  echo "interface is empty"
else
  echo "$_get_ip -> $_first, $_second, $_third, $_fourth"
  echo "third one is $_third"
fi

if [ "$_third" != "1" ] || [ "$_first" != "192" ] || [ "$_second" != "168" ];then
  #get the interface ip
  _get_interface_ip="$(ifconfig eth0:0|grep "inet addr:"| tail -1 | cut -d ':' -f 2 | cut -d ' ' -f 1)"
  echo $_get_interface_ip

  _inter_first=${_get_interface_ip%%.*}
  _inter_last3=${_get_interface_ip#*.}
  _inter_second=${_inter_last3%%.*}
  _inter_last2=${_inter_last3#*.}
  _inter_third=${_inter_last2%.*}
  _inter_fourth=${_inter_last2#*.}

  if [ ! $_inter_third ];then
    echo "interface ip is empty"
  else 
    echo "$_get_interface_ip -> $_inter_first, $_inter_second, $_inter_third, $_inter_fourth"
    echo "interface third one is $_inter_third" 
  fi

  #judg the interface ip and change it
  if [ "$_inter_third" != "1" ] || [ "$_inter_first" != "192" ] || [ "$_inter_second" != "168" ];then

    echo "---------"
    sudo ip addr add $_set_ip/24 brd + dev eth0 label eth0:0
    echo "resetting ip addr"

    _intertest_ip="$(ifconfig eth0:0|grep "inet addr:"| tail -1 | cut -d ':' -f 2 | cut -d ' ' -f 1)"
    echo "------71 $_intertest_ip"
    _intertest_last3=${_intertest_ip#*.}
    _intertest_last2=${_intertest_last3#*.}
    _intertest_third=${_intertest_last2%.*}

    if [ "$_intertest_third" == "1" ];then
      echo "set suceess!!"
    else 
      echo "can not change the setting"
        # for ((i=1; i <= 3; i++))
        # do
        #   sudo ip addr del $_set_ip/24 brd + dev eth0 label eth0:0
        #   echo "error ip addr add agin: $i"
        #   sudo ip addr add $_set_ip/24 brd + dev eth0 label eth0:0
        #   _test_ip ="$(ifconfig|grep -A 1 'eth0' | tail -1 | cut -d ':' -f 2 | cut -d ' ' -f 1)"
        #   _inter_last3 =${_test_ip#*.}
        #   _inter_last2 =${_inter_last3#*.}
        #   _inter_third =${_inter_last2%.*}
          
        #   if [ "$_inter_third" == "1" ];then
        #     sudo ip addr add $_set_ip/24 brd + dev eth0 label eth0:0
        #     echo "set suceess!!!!"
        #     exit 1
        #   fi
        # done
    fi

      #check the interface subnet mask
    _get_interface_Mask="$(ifconfig eth0|grep "Mask:"| tail -1 | cut -d ':' -f 4 | cut -d ' ' -f 2)"
    echo "$-----the interface subnet mask $_get_interface_Mask"

    _first_interface_Mask=${_get_interface_Mask%%.*}
    _last3_interface_Mask=${_get_interface_Mask#*.}
    _second_interface_Mask=${_last3_interface_Mask%%.*}
    _last2_interface_Mask=${_last3_interface_Mask#*.}
    _third_interface_Mask=${_last2_interface_Mask%.*}
    _fourth_interfcae_Mask=${_last2_interface_Mask#*.}

    echo "$_get_interface_Mask -> $_first_interface_Mask, $_second_interface_Mask, $_third_interface_Mask, $_fourth_interfcae_Mask"
    echo "third one is $_third_interface_Mask" 

    if [ "$_third_interface_Mask" != "255" ] || [ "$_first_interface_Mask" != "255" ] || [ "$_second_interface_Mask" != "255" ] || [ "$_fourth_interfcae_Mask" != "0" ];then
      echo "Mask is file,change the mask"
      sudo ifconfig eth0:0 netmask 255.255.255.0
    fi

  else 
    # PI=$(ping -c 1 $_set_ip | grep -q 'ttl=' && echo "$_set_ip yes"|| echo "$_set_ip no")
    # echo "THIS $PI"
    
    #   if [ "$PI" == "$_set_ip yes" ];then
    #     echo "find the crame"
    #   else
    #     echo "can not find the crame"
    echo "passed the test"
  fi
else
  echo "passed the test"
fi



