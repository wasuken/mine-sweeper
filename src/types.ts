type PanelKind = "panel" | "empty" | "bom";
type PanelStatus = "close" | "open";
export type Panel = {
  kind: PanelKind;
  status: PanelStatus;
  // パネルが空いてなかったり、爆弾の場合はnull
  aroundNum: null | number;
};

export type Board = Panel[][];
