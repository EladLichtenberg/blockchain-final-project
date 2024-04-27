// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20Base {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public _totalSupply;

    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) public allowed;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _total
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _totalSupply = _total;
        _balances[msg.sender] = _totalSupply;
    }

    function transfer(address payable to, uint256 value) public {
        require(_balances[msg.sender] >= value);
        require(to != address(0));
        _balances[msg.sender] -= value;
        _balances[to] += value;
        emit Transfer(msg.sender, to, value);
    }

    function approve(address payable spender, uint256 value) public {
        require(spender != address(0));
        require(_balances[msg.sender] >= value);

        //mapping(address => mapping(address => uint256)) storage allowed;
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
    }

    function transferFrom(
        address payable from,
        address payable to,
        uint256 value
    ) virtual public {
        require(to != address(0));
        require(_balances[from] >= value);
        //mapping(address => mapping(address => uint256)) storage allowed;
        require(allowed[from][msg.sender] >= value);

        _balances[from] -= value;
        allowed[from][msg.sender] -= value;
        _balances[to] += value;
        emit Transfer(from, to, value);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function allowance(address payable owner, address payable spender)
        public
        view
        returns (uint256)
    {
        //mapping(address => mapping(address => uint256)) storage allowed;
        return allowed[owner][spender];
    }

      function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        //_beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        //unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += amount;
        //}
        emit Transfer(address(0), account, amount);

        //_afterTokenTransfer(address(0), account, amount);
    }
}
