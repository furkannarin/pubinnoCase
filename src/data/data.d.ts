import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { Dataset } from "react-native-chart-kit/dist/HelperTypes";

type LocDataGraphData = Record<DataTypes, LineChartData> | null

type DateRange = {
    day: string
    month: string
    year: string
}
  
// in MS
type GraphDateRange = {
    start: number
    end: number
}

type DayInMSAsAKey = string
type Structured = {
    total: {
        litersSold: number
        quality: number
        efficiency: number
    }
    best: {
        brand: string
        amount: number
        location: string
    }
}

type LocData = {
    sold: number
    efficiency: number
    quality: number
}

type LocMap = Record<DayInMSAsAKey, Record<string, LocData>>

type StructuredData = Record<DayInMSAsAKey, Structured>;