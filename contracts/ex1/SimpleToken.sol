//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

contract SimpleToken {

  // struct Holder {
  //   address holder;
  //   uint256 balance;
  // }

  address private _owner;
  //Holder[] private _balances;
  mapping(address => uint) public _balances;

  modifier onlyOwner {
    require(msg.sender == _owner);
    _;
  }

  constructor() {
    _owner = msg.sender;
  }

  function mint(address destination, uint256 amount) external onlyOwner {
    _balances[destination] += amount;
  }

  function balanceOf(address holder) public view returns(uint256 balance_) {
    balance_ = _balances[holder];
  }
}
