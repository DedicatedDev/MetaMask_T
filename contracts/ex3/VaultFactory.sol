//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

interface IVault {
  function setVaultLimit(uint) external;
}

contract VaultFactory {

  uint _vaultLimit;

  constructor(uint vaultLimit) {
    _vaultLimit = vaultLimit;
  }

  function initVault(IVault vault) public payable {
    require(_vaultLimit >= msg.value , "exceed deposit limitation");
    vault.setVaultLimit(_vaultLimit);
    address payable vaultAddress = payable(address(vault));
    vaultAddress.call{value: msg.value}("");
  }
}