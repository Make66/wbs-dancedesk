/**
 * Workaround for TypeScript failing to resolve `React.Component` membership
 * through the intersection type pattern react-native 0.81 uses for class components:
 *
 *   declare const XBase: Constructor<NativeMethods> & typeof XComponent;
 *   export class X extends XBase {}
 *
 * TypeScript cannot prove `X` instances extend `React.Component<P>` through
 * that intersection, causing TS2607 ("no props property") and TS2786
 * ("cannot be used as JSX component"). Augmenting the interfaces to explicitly
 * extend React.Component restores both checks.
 */
import type React from 'react';

declare module 'react-native' {
  interface View extends React.Component<ViewProps> {}
  interface Text extends React.Component<TextProps> {}
  interface TextInput extends React.Component<TextInputProps> {}
  interface ActivityIndicator extends React.Component<ActivityIndicatorProps> {}
  interface ScrollView extends React.Component<ScrollViewProps> {}
  interface Switch extends React.Component<SwitchProps> {}
  interface Image extends React.Component<ImageProps> {}
  interface FlatList<T = any> extends React.Component<FlatListProps<T>> {}
}
