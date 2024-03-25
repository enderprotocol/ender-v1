### Variables Definition:

1. **`P`** (Principal): The initial amount staked.
2. **`t`** (Time): The total time, in days, that the amount is staked.
3. **`Y(t)`** (Yield Rate): The annual yield rate, which varies depending on the staking period.

### Yield Rate Function, `Y(t)`:

Based on the duration `t`, the annual yield rate `Y(t)` (as a decimal) is determined as follows:

-   For `7 ≤ t < 15`: `Y(t) = -0.30`
-   For `15 ≤ t < 30`: `Y(t) = -0.20`
-   For `30 ≤ t < 60`: `Y(t) = -0.15`
-   For `60 ≤ t < 90`: `Y(t) = -0.10`
-   For `90 ≤ t < 120`: `Y(t) = 0.00` (Base Rate)
-   For `120 ≤ t < 150`: `Y(t) = 0.05`
-   For `150 ≤ t < 180`: `Y(t) = 0.10`
-   For `180 ≤ t < 220`: `Y(t) = 0.15`
-   For `220 ≤ t < 260`: `Y(t) = 0.20`
-   For `260 ≤ t < 280`: `Y(t) = 0.25`
-   For `280 ≤ t < 320`: `Y(t) = 0.30`
-   For `320 ≤ t < 360`: `Y(t) = 0.40`
-   For `t ≥ 360`: `Y(t) = 0.50`

### Final Amount Calculation:

The final amount `A` after staking for `t` days at the variable rate `Y(t)` is given by the formula:

\[A = P \times (1 + \frac{Y(t) \times t}{365})\]

### Smart Contract Integration:

In a smart contract, this logic can be implemented by defining ranges for `t` and corresponding changes to the calculation of the final amount based on `Y(t)`. Smart contracts do not support real numbers, so you need to handle decimal points manually, often by scaling all values by a factor (such as 10^18, a common practice in Ethereum contracts to deal with wei and ether).

### Example in Pseudo Solidity Code:

```solidity
function calculateFinalAmount(uint256 P, uint256 t) public pure returns (uint256) {
    int256 Y;
    if (7 <= t && t < 15) Y = -30;
    else if (15 <= t && t < 30) Y = -20;
    // Add other conditions here
    else if (320 <= t && t < 360) Y = 40;
    else if (t >= 360) Y = 50;
    else Y = 0; // Default case

    // Convert Y to a proper fraction considering the solidity doesn't handle decimals
    int256 rate = Y * 10**16; // Convert percentage to a fraction (e.g., 5% becomes 0.05)
    uint256 duration = (t * 10**18) / 365; // Convert days to fraction of year

    // Final amount calculation, considering the yield rate and ensuring no overflow for negative rates
    if (Y > 0) {
        return P + (P * uint256(rate) * duration) / (365 * 10**36);
    } else {
        return P - (P * uint256(-rate) * duration) / (365 * 10**36);
    }
}
```
