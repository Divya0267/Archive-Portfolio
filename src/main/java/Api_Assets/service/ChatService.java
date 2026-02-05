package Api_Assets.service;

import Api_Assets.dto.UserAssetRecommendation;
import Api_Assets.entity.UserAsset;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {

    private final RecommendationService recommendationService;
    private final GeminiService geminiService;

    public ChatService(RecommendationService recommendationService,
                       GeminiService geminiService) {
        this.recommendationService = recommendationService;
        this.geminiService = geminiService;
    }

    public String processMessage(String message) {
        if (message == null || message.isBlank()) {
            return "Please enter a valid query. Examples: \"suggest top 5 stocks\", \"suggest top 3 crypto\", \"top 5 assets\", or \"is my portfolio concentrated?\"";
        }

        String msg = message.toLowerCase();
        int n = extractNumber(msg, 3);

        if (msg.contains("concentrated") || msg.contains("diversif") || msg.contains("diversification")) {
            List<UserAsset> allStocks = recommendationService.getAllStocks();
            String diversification = analyzeStockDiversification(allStocks);
            return diversification;
        }

        if ((msg.contains("top") || msg.contains("suggest")) && msg.contains("stock")) {
            List<UserAsset> allStocks = recommendationService.getAllStocks();
            String diversification = analyzeStockDiversification(allStocks);
            List<UserAssetRecommendation> topStocks = recommendationService.getTopNStocksSuggestions(n);
            if (topStocks.isEmpty()) return "No stock suggestions available.";
            return buildNumberedResponse(topStocks, n, "stocks", diversification);
        }

        if ((msg.contains("top") || msg.contains("suggest")) && msg.contains("crypto")) {
            List<UserAssetRecommendation> topCrypto = recommendationService.getTopNCryptoSuggestions(n);
            if (topCrypto.isEmpty()) return "No crypto suggestions available.";
            return buildNumberedResponse(topCrypto, n, "crypto", null);
        }

        if (msg.contains("top") || (msg.contains("suggest") && msg.contains("asset"))) {
            List<UserAssetRecommendation> topAssets = recommendationService.getTopNAssetsSuggestions(n);
            if (topAssets.isEmpty()) return "No asset suggestions available.";
            return buildNumberedResponse(topAssets, n, "assets", null);
        }

        return getDefaultResponse(message);
    }

    private String analyzeStockDiversification(List<UserAsset> stocks) {
        if (stocks.isEmpty()) return "**No stocks.** Why: Add stocks to see diversification.";

        long totalStocks = stocks.stream().map(UserAsset::getSymbol).distinct().count();

        if (totalStocks <= 2) {
            return "**Concentrated.** Why: You hold only " + totalStocks + " stock(s). Risk is high. Add more to diversify.";
        }
        if (totalStocks <= 4) {
            return "**Moderate.** Why: " + totalStocks + " stocks. Add 1–2 more for better diversification.";
        }
        if (totalStocks >= 8) {
            return "**Well diversified.** Why: " + totalStocks + " stocks — good spread, lower single-name risk.";
        }
        return "**Good diversification.** Why: " + totalStocks + " stocks — balanced.";
    }

    /** Builds a numbered list of exactly the assets returned (up to requested n). Never truncates to 1. */
    private String buildNumberedResponse(List<UserAssetRecommendation> assets, int requestedN, String type, String diversification) {
        StringBuilder sb = new StringBuilder();
        int index = 1;
        for (UserAssetRecommendation a : assets) {
            String action = actionFromRisk(a.getRiskLevel(), a.getProfitPercent());
            sb.append(index++).append(". **").append(a.getSymbol()).append("** – ")
                    .append(action).append(" – ").append(formatPercent(a.getProfitPercent())).append("\n");
        }
        if (assets.size() < requestedN) {
            sb.append("(Only ").append(assets.size()).append(" ").append(type).append(" in portfolio; you asked for ").append(requestedN).append(".)");
        } else {
            sb.setLength(sb.length() - 1); // drop trailing newline
        }
        if (diversification != null && !diversification.isEmpty()) {
            sb.append("\n\n").append(diversification);
        }
        return sb.toString().trim();
    }

    private String actionFromRisk(String riskLevel, BigDecimal profitPercent) {
        if (riskLevel != null) {
            if ("HIGH".equalsIgnoreCase(riskLevel)) return "Review";
            if ("MEDIUM".equalsIgnoreCase(riskLevel)) return "Hold";
            if ("LOW".equalsIgnoreCase(riskLevel)) return profitPercent != null && profitPercent.compareTo(BigDecimal.ZERO) > 0 ? "Buy" : "Hold";
        }
        return profitPercent != null && profitPercent.compareTo(BigDecimal.valueOf(20)) >= 0 ? "Buy" : "Hold";
    }

    private String getDefaultResponse(String message) {
        return "**Try:** suggest top 5 stocks | suggest top 3 crypto | top 5 assets | is my portfolio concentrated?";
    }

    private int extractNumber(String text, int defaultValue) {
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? Integer.parseInt(matcher.group()) : defaultValue;
    }

    private String formatPercent(BigDecimal percent) {
        if (percent == null) return "0.0%";
        return (percent.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") +
                percent.setScale(1, RoundingMode.HALF_UP) + "%";
    }
}
