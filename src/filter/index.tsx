import React, { FC } from 'react';
import { Block } from 'baseui/block';
import { RangePlot } from './plots';
import { HistogramBin } from './plots/type';

export type HistogramProp = {
  domain: number[];
  data: HistogramBin[];
  step: number;
  dataType: string;
  format: string;
};

type FilterSelectionContentProps = {
  histogram: HistogramProp;
  value: number[];
  onChangeRange: ([v0, v1]: number[]) => void;
};

const FilterSelectionRangePlot: FC<FilterSelectionContentProps> = ({
  histogram,
  onChangeRange,
  value,
}) => {
  const { domain, data, dataType, step = 0.01, format } = histogram;

  return (
    <div style={{ marginTop: '100px', marginLeft: '100px' }}>
      <RangePlot
        range={domain}
        histogram={data}
        step={step}
        dataType={dataType}
        value={value}
        onChange={onChangeRange}
        width={255}
        height={90}
        xAxisFormat={format}
      />
    </div>
  );
};

export default FilterSelectionRangePlot;
