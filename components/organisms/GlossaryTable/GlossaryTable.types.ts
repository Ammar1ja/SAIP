export interface GlossaryTableProps {
  data: GlossaryEntry[];
}

type GlossaryEntry = {
  english: string;
  arabic: string;
  description: string;
};
