export const FLOATING_TAB_BAR_HEIGHT = 76;
export const FLOATING_TAB_BAR_RADIUS = 28;
export const FLOATING_TAB_BAR_MIN_BOTTOM = 0;
export const FLOATING_TAB_CENTER_OVERHANG = 42;

export function getFloatingTabBarBottomOffset(bottomInset: number) {
  return bottomInset + FLOATING_TAB_BAR_MIN_BOTTOM;
}

export function getFloatingTabBarContentPadding(bottomInset: number, extra = 40) {
  return (
    FLOATING_TAB_BAR_HEIGHT +
    getFloatingTabBarBottomOffset(bottomInset) +
    FLOATING_TAB_CENTER_OVERHANG +
    extra
  );
}
