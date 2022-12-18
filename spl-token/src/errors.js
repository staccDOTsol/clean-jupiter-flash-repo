"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.TokenInvalidInstructionTypeError = exports.TokenInvalidInstructionDataError = exports.TokenInvalidInstructionKeysError = exports.TokenInvalidInstructionProgramError = exports.TokenOwnerOffCurveError = exports.TokenInvalidOwnerError = exports.TokenInvalidMintError = exports.TokenInvalidAccountSizeError = exports.TokenInvalidAccountOwnerError = exports.TokenAccountNotFoundError = exports.TokenError = void 0;
/** Base class for errors */
var TokenError = /** @class */ (function (_super) {
    __extends(TokenError, _super);
    function TokenError(message) {
        return _super.call(this, message) || this;
    }
    return TokenError;
}(Error));
exports.TokenError = TokenError;
/** Thrown if an account is not found at the expected address */
var TokenAccountNotFoundError = /** @class */ (function (_super) {
    __extends(TokenAccountNotFoundError, _super);
    function TokenAccountNotFoundError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenAccountNotFoundError';
        return _this;
    }
    return TokenAccountNotFoundError;
}(TokenError));
exports.TokenAccountNotFoundError = TokenAccountNotFoundError;
/** Thrown if a program state account is not owned by the expected token program */
var TokenInvalidAccountOwnerError = /** @class */ (function (_super) {
    __extends(TokenInvalidAccountOwnerError, _super);
    function TokenInvalidAccountOwnerError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidAccountOwnerError';
        return _this;
    }
    return TokenInvalidAccountOwnerError;
}(TokenError));
exports.TokenInvalidAccountOwnerError = TokenInvalidAccountOwnerError;
/** Thrown if the byte length of an program state account doesn't match the expected size */
var TokenInvalidAccountSizeError = /** @class */ (function (_super) {
    __extends(TokenInvalidAccountSizeError, _super);
    function TokenInvalidAccountSizeError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidAccountSizeError';
        return _this;
    }
    return TokenInvalidAccountSizeError;
}(TokenError));
exports.TokenInvalidAccountSizeError = TokenInvalidAccountSizeError;
/** Thrown if the mint of a token account doesn't match the expected mint */
var TokenInvalidMintError = /** @class */ (function (_super) {
    __extends(TokenInvalidMintError, _super);
    function TokenInvalidMintError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidMintError';
        return _this;
    }
    return TokenInvalidMintError;
}(TokenError));
exports.TokenInvalidMintError = TokenInvalidMintError;
/** Thrown if the owner of a token account doesn't match the expected owner */
var TokenInvalidOwnerError = /** @class */ (function (_super) {
    __extends(TokenInvalidOwnerError, _super);
    function TokenInvalidOwnerError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidOwnerError';
        return _this;
    }
    return TokenInvalidOwnerError;
}(TokenError));
exports.TokenInvalidOwnerError = TokenInvalidOwnerError;
/** Thrown if the owner of a token account is a PDA (Program Derived Address) */
var TokenOwnerOffCurveError = /** @class */ (function (_super) {
    __extends(TokenOwnerOffCurveError, _super);
    function TokenOwnerOffCurveError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenOwnerOffCurveError';
        return _this;
    }
    return TokenOwnerOffCurveError;
}(TokenError));
exports.TokenOwnerOffCurveError = TokenOwnerOffCurveError;
/** Thrown if an instruction's program is invalid */
var TokenInvalidInstructionProgramError = /** @class */ (function (_super) {
    __extends(TokenInvalidInstructionProgramError, _super);
    function TokenInvalidInstructionProgramError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidInstructionProgramError';
        return _this;
    }
    return TokenInvalidInstructionProgramError;
}(TokenError));
exports.TokenInvalidInstructionProgramError = TokenInvalidInstructionProgramError;
/** Thrown if an instruction's keys are invalid */
var TokenInvalidInstructionKeysError = /** @class */ (function (_super) {
    __extends(TokenInvalidInstructionKeysError, _super);
    function TokenInvalidInstructionKeysError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidInstructionKeysError';
        return _this;
    }
    return TokenInvalidInstructionKeysError;
}(TokenError));
exports.TokenInvalidInstructionKeysError = TokenInvalidInstructionKeysError;
/** Thrown if an instruction's data is invalid */
var TokenInvalidInstructionDataError = /** @class */ (function (_super) {
    __extends(TokenInvalidInstructionDataError, _super);
    function TokenInvalidInstructionDataError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidInstructionDataError';
        return _this;
    }
    return TokenInvalidInstructionDataError;
}(TokenError));
exports.TokenInvalidInstructionDataError = TokenInvalidInstructionDataError;
/** Thrown if an instruction's type is invalid */
var TokenInvalidInstructionTypeError = /** @class */ (function (_super) {
    __extends(TokenInvalidInstructionTypeError, _super);
    function TokenInvalidInstructionTypeError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'TokenInvalidInstructionTypeError';
        return _this;
    }
    return TokenInvalidInstructionTypeError;
}(TokenError));
exports.TokenInvalidInstructionTypeError = TokenInvalidInstructionTypeError;
