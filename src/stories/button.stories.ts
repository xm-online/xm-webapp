// Button.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

const meta: Meta<MatButton> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'Button',
    component: MatButton,
    decorators: [
        moduleMetadata({
            imports: [
                MatIconModule,
                MatButtonModule,
                MatDividerModule
            ],
        })],


};

export default meta;
type Story = StoryObj<MatButton>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/angular/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
    render: () => ({
        template: `
        <section>
  <div class="example-label">Basic</div>
  <div class="example-button-row w-100 d-flex justify-content-between p-4">
    <button mat-button>Basic</button>
    <button mat-button color="primary">Primary</button>
    <button mat-button color="accent">Accent</button>
    <button mat-button color="warn">Warn</button>
    <button mat-button disabled>Disabled</button>
    <a mat-button href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>

<mat-divider></mat-divider>
<section>
  <div class="example-label">Flat</div>
  <div class="example-button-row w-100 d-flex justify-content-between p-4">
    <button mat-flat-button>Basic</button>
    <button mat-flat-button color="primary">Primary</button>
    <button mat-flat-button color="accent">Accent</button>
    <button mat-flat-button color="warn">Warn</button>
    <button mat-flat-button disabled>Disabled</button>
    <a mat-flat-button href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>`,
    }),
};

export const Secondary: Story = {
    render: () => ({
        template: `
<section>
  <div class="example-label">Stroked</div>
  <div class="example-button-row w-100 d-flex justify-content-between p-4">
    <button mat-stroked-button>Basic</button>
    <button mat-stroked-button color="primary">Primary</button>
    <button mat-stroked-button color="accent">Accent</button>
    <button mat-stroked-button color="warn">Warn</button>
    <button mat-stroked-button disabled>Disabled</button>
    <a mat-stroked-button href="https://www.google.com/" target="_blank">Link</a>
  </div>
</section>`,
    }),
};

export const Tertiary: Story = {
    render: () => ({
        template: `
        <section>
          <div class="example-label">Icon</div>
          <div class="example-button-row w-100 d-flex justify-content-between p-4">
            <div class="example-flex-container">
              <button mat-icon-button aria-label="Example icon button with a vertical three dot icon">
                <mat-icon>more_vert</mat-icon>
              </button>
              <button mat-icon-button color="primary" aria-label="Example icon button with a home icon">
                <mat-icon>home</mat-icon>
              </button>
              <button mat-icon-button color="accent" aria-label="Example icon button with a menu icon">
                <mat-icon>menu</mat-icon>
              </button>
              <button mat-icon-button color="warn" aria-label="Example icon button with a heart icon">
                <mat-icon>favorite</mat-icon>
              </button>
              <button mat-icon-button disabled aria-label="Example icon button with a open in new tab icon">
                <mat-icon>open_in_new</mat-icon>
              </button>
            </div>
          </div>
        </section>`,
    }),
};
