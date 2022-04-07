/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
// @ts-nocheck
// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
//  https://github.com/keplergl/kepler.gl/blob/master/src/utils/data-utils.js

import React, { Component, createRef } from 'react';
import { select } from 'd3-selection';
import { brushX } from 'd3-brush';
import styled from 'styled-components';
import { normalizeSliderValue } from './utils';

const StyledG = styled.g`
  .selection {
    stroke: none;
    fill-opacity: 0.3;
  }
`;

function moveRight(startSel, selection) {
  const [startSel0] = startSel;
  const [sel0] = selection;

  return Boolean(startSel0 === sel0);
}
// style brush resize handle
// https://github.com/crossfilter/crossfilter/blob/gh-pages/index.html#L466
const getHandlePath = (props) => {
  return function brushResizePath(d) {
    const e = Number(d.type === 'e');
    const x = e ? 1 : -1;
    const h = 39;
    const w = 4.5;
    const y = (props.height - h) / 2;
    return `M${0.5 * x},${y}c${2.5 * x},0,${w * x},2,${w * x},${w}v${
      h - w * 2
    }c0,2.5,${-2 * x},${w},${-w * x},${w}V${y}z`;
  };
};

class RangeBrush extends Component {
  componentDidMount() {
    // We want the React app to respond to brush state and vice-versa
    // but d3-brush fires the same events for both user-initiated brushing
    // and programmatic brushing (brush.move). We need these flags to
    // distinguish between the uses.
    //
    // We don't use state because that would trigger another `componentDidUpdate`
    const { isRanged, onMouseoverHandle, onMouseoutHandle } = this.props;
    this.brushing = false;
    this.moving = false;

    this.root = select(this.rootContainer.current);
    this.brush = brushX()
      .handleSize(3)
      .on('start', (event) => {
        if (typeof this.props.onBrushStart === 'function')
          this.props.onBrushStart();
        this._startSel = event.selection;
      })
      .on('brush', (event) => {
        if (this.moving) {
          return;
        }
        if (event.selection) {
          this.brushing = true;
          this._brushed(event);
        }
      })
      .on('end', (event) => {
        const {
          range: [min, max],
          step,
          width,
          marks,
        } = this.props;

        if (!this.brushing && this._startSel && !event.selection) {
          // handle click

          this._click(this._startSel);
        }
        if (
          typeof this.props.onBrushEnd === 'function' &&
          event.selection !== null &&
          this.brushing
        ) {
          const [sel0, sel1] = event.selection;
          const invert = (x) => (x * (max - min)) / width + min;
          let d0 = invert(sel0);
          let d1 = invert(sel1);

          d0 = normalizeSliderValue(d0, min, step, marks);
          d1 = normalizeSliderValue(d1, min, step, marks);
          this.props.onBrushEnd(d0, d1);
        }

        this.brushing = false;
        this.moving = false;
      });

    this.root.call(this.brush);
    const brushResizePath = getHandlePath(this.props);
    this.handle = this.root
      .selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter()
      .append('path')
      .attr('class', 'handle--custom')
      .attr('display', isRanged ? null : 'none')
      .attr('fill', '#D3D8E0')
      .attr('cursor', 'ew-resize')
      .attr('d', brushResizePath)
      .on('mouseover', () => {
        if (onMouseoverHandle) onMouseoverHandle();
      })
      .on('mouseout', () => {
        if (onMouseoutHandle) onMouseoutHandle();
      });

    const {
      value: [val0, val1],
    } = this.props;
    this.moving = true;
    this._move(val0, val1);
  }

  componentDidUpdate(prevProps) {
    const {
      value: [val0, val1],
      width,
    } = this.props;
    const [prevVal0, prevVal1] = prevProps.value;

    if (prevProps.width !== width) {
      // width change should not trigger this._brushed
      this.moving = true;
      this.root.call(this.brush);
      this._move(val0, val1);
    }

    if (!this.brushing && !this.moving) {
      if (prevVal0 !== val0 || prevVal1 !== val1) {
        this.moving = true;
        this._move(val0, val1);
      }
    }

    if (!this.props.isRanged) {
      this.handle.attr('display', 'none');
    }
  }

  // eslint-disable-next-line react/sort-comp
  rootContainer = createRef();

  // eslint-disable-next-line react/sort-comp
  _click(selection) {
    // fake brush
    this.brushing = true;
    this._brushed({ sourceEvent: {}, selection });
  }

  _move(val0, val1) {
    const {
      range: [min, max],
      width,
      isRanged,
    } = this.props;

    if (width && max - min) {
      const scale = (x) => ((x - min) * width) / (max - min);
      if (!isRanged) {
        // only draw a 1 pixel line
        this.brush.move(this.root, [scale(val0), scale(val0) + 1]);
      } else {
        this.brush.move(this.root, [scale(val0), scale(val1)]);

        this.handle
          .attr('display', null)
          .attr(
            'transform',
            (d, i) => `translate(${[i === 0 ? scale(val0) : scale(val1), 0]})`,
          );
      }
    }
  }

  _brushed = (evt) => {
    // Ignore brush events which don't have an underlying sourceEvent
    if (!evt.sourceEvent) return;
    const [sel0, sel1] = evt.selection;
    const right = moveRight(this._startSel, evt.selection);

    const {
      range: [min, max],
      step,
      width,
      marks,
      isRanged,
    } = this.props;
    const invert = (x) => (x * (max - min)) / width + min;
    let d0 = invert(sel0);
    let d1 = invert(sel1);

    d0 = normalizeSliderValue(d0, min, step, marks);
    d1 = normalizeSliderValue(d1, min, step, marks);

    if (isRanged) this._move(d0, d1);
    else this._move(...(right ? [d1, d1] : [d0, d0]));

    if (isRanged) this._onBrush(d0, d1);
    else this._onBrush(right ? d1 : d0);
  };

  _onBrush(val0, val1) {
    const {
      isRanged,
      value: [currentVal0, currentVal1],
    } = this.props;

    if (currentVal0 === val0 && currentVal1 === val1) {
      return;
    }

    if (isRanged) {
      this.props.onBrush(val0, val1);
    } else {
      this.props.onBrush(val0, val0);
    }
  }

  render() {
    const { isRanged } = this.props;
    return (
      <StyledG
        className='kg-range-slider__brush'
        isRanged={isRanged}
        ref={this.rootContainer}
      />
    );
  }
}

RangeBrush.defaultProps = {
  isRanged: true,
};

export default RangeBrush;
