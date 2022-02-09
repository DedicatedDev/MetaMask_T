//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

contract SharesFund {

  mapping(address => uint256) private _shares;

  function deposit() public payable {
    _shares[msg.sender] += msg.value;
  }

  function withdraw(uint256 amount) public {
    require(_shares[msg.sender] >= amount, "Not enough shares");
    if(amount > _shares[msg.sender]) {
        _shares[msg.sender] = 0;
    } else {
        _shares[msg.sender] -= amount;
    }
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Withdraw failed");
  }

  function shares(address addr) public view returns (uint256) {
    return _shares[addr];
  }

  function getBalance() public view returns(uint256) {
    return address(this).balance;
  }
}
