//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

/**
  * Do not modify this contract
 */
contract Vault {

  int _vaultLimit;

  function setVaultLimit(int vaultLimit) public {
    _vaultLimit = vaultLimit;
  }

  receive() external payable {
    require(_vaultLimit == -1 || address(this).balance <= uint(_vaultLimit), "Vault limit reached");
    // transfer accepted
  }

  fallback() external {
    // set to unlimited mode
    _vaultLimit = -1;
  }

  function getBalance() public view returns(uint256) {
    return address(this).balance;
  }
}
