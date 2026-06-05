// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface ICartonSalesTreasury {
    function isSupportedPrizeToken(address token) external view returns (bool);
    function salesClosed(uint256 tournamentId) external view returns (bool);
    function isTournamentRegistered(uint256 tournamentId) external view returns (bool);
}

contract CartonSalesConfig {
    error TokenNotAccepted();
    error TokenPriceNotSet();
    error PriceMustBePositive();
    error ZeroTreasuryAddress();
    error TreasuryAddressNotContract();
    error InvalidTreasuryContract();
    error ZeroTournamentId();
    error ZeroTokenAddress();
    error TournamentSalesClosed();
    error TournamentNotRegistered();
    error UnsupportedPrizeToken();
    error NotCarton();

    mapping(address => bool) private _acceptedTokens;
    mapping(uint256 => mapping(address => uint256)) private _tokenPricesByTournament;

    address private _treasury;
    uint256 private _activeTournamentId;
    address public immutable CARTON;

    constructor(address cartonAddress) {
        CARTON = cartonAddress;
    }

    modifier onlyCarton() {
        _onlyCarton();
        _;
    }

    function _onlyCarton() internal view {
        if (msg.sender != CARTON) revert NotCarton();
    }

    function acceptedTokens(address token) external view returns (bool) {
        return _acceptedTokens[token];
    }

    function tokenPricesByTournament(uint256 tournamentId, address token) external view returns (uint256) {
        return _tokenPricesByTournament[tournamentId][token];
    }

    function treasury() external view returns (address) {
        return _treasury;
    }

    function activeTournamentId() external view returns (uint256) {
        return _activeTournamentId;
    }

    function setAcceptedToken(address token, bool accepted) external onlyCarton {
        if (token == address(0)) revert ZeroTokenAddress();

        address treasuryAddress = _treasury;
        if (
            accepted && treasuryAddress != address(0)
                && !ICartonSalesTreasury(treasuryAddress).isSupportedPrizeToken(token)
        ) {
            revert UnsupportedPrizeToken();
        }

        _acceptedTokens[token] = accepted;
    }

    function setTokenPrice(uint256 tournamentId, address token, uint256 price) external onlyCarton {
        if (tournamentId == 0) revert ZeroTournamentId();
        if (price == 0) revert PriceMustBePositive();
        _tokenPricesByTournament[tournamentId][token] = price;
    }

    function tokenPrices(address token) external view returns (uint256) {
        return _tokenPricesByTournament[_activeTournamentId][token];
    }

    function setTreasuryAddress(address treasuryAddress) external onlyCarton {
        if (treasuryAddress == address(0)) revert ZeroTreasuryAddress();
        if (treasuryAddress.code.length == 0) revert TreasuryAddressNotContract();

        (bool ok, bytes memory data) =
            treasuryAddress.staticcall(abi.encodeWithSelector(ICartonSalesTreasury.isTournamentRegistered.selector, 0));
        if (!ok || data.length != 32) revert InvalidTreasuryContract();

        _treasury = treasuryAddress;
    }

    function setActiveTournament(uint256 tournamentId) external onlyCarton {
        if (tournamentId == 0) revert ZeroTournamentId();
        _activeTournamentId = tournamentId;
    }

    function validateTournamentSelection(uint256 tournamentId) external view {
        if (tournamentId == 0) revert ZeroTournamentId();

        address treasuryAddress = _treasury;
        if (
            treasuryAddress != address(0) && !ICartonSalesTreasury(treasuryAddress).isTournamentRegistered(tournamentId)
        ) {
            revert TournamentNotRegistered();
        }
    }

    function getPurchaseContext(uint256 tournamentId, address token)
        external
        view
        returns (uint256 amount, address treasuryAddress)
    {
        if (tournamentId == 0) revert ZeroTournamentId();

        treasuryAddress = _treasury;
        if (
            treasuryAddress != address(0) && !ICartonSalesTreasury(treasuryAddress).isTournamentRegistered(tournamentId)
        ) {
            revert TournamentNotRegistered();
        }
        if (!_acceptedTokens[token]) revert TokenNotAccepted();

        amount = _tokenPricesByTournament[tournamentId][token];
        if (amount == 0) revert TokenPriceNotSet();

        if (treasuryAddress != address(0)) {
            ICartonSalesTreasury treasuryContract = ICartonSalesTreasury(treasuryAddress);
            if (!treasuryContract.isSupportedPrizeToken(token)) revert UnsupportedPrizeToken();
            if (treasuryContract.salesClosed(tournamentId)) revert TournamentSalesClosed();
        }
    }
}
