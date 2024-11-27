interface MarketInsights {
  hotLanes: Array<{
    origin: string;
    destination: string;
    avgRate: number;
    demandIndex: number;
    volume: number;
  }>;
  commodityTrends: Array<{
    commodity: string;
    pricePerPound: number;
    trend: number;
    volume: number;
  }>;
  regionalDemand: Array<{
    region: string;
    demandScore: number;
    avgRate: number;
  }>;
}

export const getMarketInsights = async (
  timeframe: 'day' | 'week' | 'month' = 'week'
): Promise<MarketInsights> => {
  const { data, error } = await supabase
    .from('market_insights')
    .select('*')
    .gte('date', getTimeframeDate(timeframe));

  if (error) throw error;

  // Process and aggregate the data
  const insights = processMarketData(data);
  return insights;
};

export const getLaneAnalysis = async (
  originState: string,
  destinationState: string,
  timeframe: 'day' | 'week' | 'month' = 'week'
) => {
  // Get historical data for specific lane
  const { data, error } = await supabase
    .from('market_insights')
    .select('*')
    .eq('origin_state', originState)
    .eq('destination_state', destinationState)
    .gte('date', getTimeframeDate(timeframe))
    .order('date', { ascending: true });

  if (error) throw error;

  return analyzeLaneData(data);
};

export const getCommodityInsights = async (
  commodityType: string,
  timeframe: 'day' | 'week' | 'month' = 'week'
) => {
  // Get commodity-specific trends
  const { data, error } = await supabase
    .from('commodity_price_trends')
    .select('*')
    .eq('commodity_type', commodityType)
    .gte('date', getTimeframeDate(timeframe))
    .order('date', { ascending: true });

  if (error) throw error;

  return analyzeCommodityTrends(data);
}; 