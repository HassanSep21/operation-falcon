export interface GraphRecord {
  source_id: string;
  source_label: string;
  source_props: Record<string, unknown>;

  relationship: string;

  target_id: string;
  target_label: string;
  target_props: Record<string, unknown>;
}
