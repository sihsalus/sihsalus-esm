interface ExtensionSlotOrderProps {
  slotName: string;
  slotModuleName: string;
  value: Array<string>;
  setValue: (value: Array<string>) => void;
}

// Not yet implemented: drag-to-reorder UI for extension slot order configuration.
export function ExtensionSlotOrder({
  slotName: _slotName,
  slotModuleName: _slotModuleName,
  value: _value,
  setValue: _setValue,
}: ExtensionSlotOrderProps) {
  return null;
}
