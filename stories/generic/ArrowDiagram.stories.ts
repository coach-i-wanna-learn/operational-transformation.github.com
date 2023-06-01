import type { Meta, StoryObj } from '@storybook/react';

import {makeArrowDiagram} from '@/generic/ArrowDiagram'
import {
  plainTextWithBasicOperationsComponents,
  plainTextWithBasicOperationsFunctions,
} from "@/applicationSpecific/plainTextWithBasicOperations";
import { makeOperationVisualization } from '@/generic/OperationVisualization';
import { makeSynchronizationStateVisualization } from '@/generic/SynchronizationStateVisualization';

import {ClientName, createNewOperation} from '@/generic/types/operation'

import {makeInsertOperation} from '@/applicationSpecific/plainTextWithBasicOperations'

const OperationVisualization = makeOperationVisualization(plainTextWithBasicOperationsComponents);
const SynchronizationStateVisualization =
  makeSynchronizationStateVisualization(OperationVisualization);
const ArrowDiagram = makeArrowDiagram(OperationVisualization);


const topLeft = { x: 20, y: 15 };
const topRight = { x: 125, y: 20 };
const bottomLeft = { x: 15, y: 120 };
const bottomRight = { x: 120, y: 125 };

const arrows = [
  {
    start: topLeft,
    end: topRight,
    tooltipPlacement: "top",
  },
  {
    start: bottomLeft,
    end: bottomRight,
    tooltipPlacement: "bottom",
  },
  {
    start: topLeft,
    end: bottomLeft,
    tooltipPlacement: "left",
  },
  {
    start: topRight,
    end: bottomRight,
    tooltipPlacement: "right",
  },
];
// <ArrowDiagram width={140} height={140} arrows={arrows} />

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ArrowDiagram> = {
  title: 'Example/ArrowDiagram',
  component: ArrowDiagram,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof ArrowDiagram>;

export const Arrow: Story = {
  args: {
    width: 140,
    height: 140,
    arrows: arrows as any
  }
}
