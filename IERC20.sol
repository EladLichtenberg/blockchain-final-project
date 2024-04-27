// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract IERC20 {    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external virtual view returns (uint256);
    function balanceOf(address who) external virtual view returns (uint256);
    function transfer(address to, uint256 value) external virtual returns (bool);
    function approve(address spender, uint256 value) external virtual returns (bool);
    function transferFrom(address from, address to, uint256 value) external virtual returns (bool);
    function allowance(address owner, address spender) external virtual view returns (uint256);
}
