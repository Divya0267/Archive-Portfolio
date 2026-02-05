package Api_Assets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketCryptoItem {
    private String symbol;
    private BigDecimal currentPrice;
    private BigDecimal priceChangePercent24h;
}
