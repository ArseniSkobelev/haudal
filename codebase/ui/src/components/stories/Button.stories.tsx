import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TextButton, FilledButton, OutlinedButton } from '../Button/Button';
import { IButtonType } from "../Button/Button.types"

export default {
  title: 'Button',
  component: TextButton,
  argTypes: {
  },
} as Meta<typeof TextButton>;

// export default

const TextTemplate: Story<IButtonType> = (args) => <TextButton {...args} />;
const FilledTemplate: Story<IButtonType> = (args) => <FilledButton {...args} />;
const OutlinedTemplate: Story<IButtonType> = (args) => <OutlinedButton {...args} />;

export const DefaultTextButton = TextTemplate.bind({});
DefaultTextButton.args = {
  disabled: false,
  text: 'Button',
};

export const DefaultFilledButton = FilledTemplate.bind({});
DefaultFilledButton.args = {
  disabled: false,
  text: 'Button',
};

export const DefaultOutlinedButton = OutlinedTemplate.bind({});
DefaultOutlinedButton.args = {
  disabled: false,
  text: 'Button',
};