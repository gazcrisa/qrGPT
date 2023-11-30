import { Concept } from '@/utils/service';

type ConceptCardProps = {
  concept: Concept;
};

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept }) => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-y-2 w-[510px] border border-gray-300 rounded shadow group p-2 mx-auto max-w-full">
      <div className="text-center">
        <p>RxCUI: {concept.code}</p>
        <p>Confidence Score: {concept.score.toFixed(2)}</p>
        <p>Description: {concept.description}</p>
        <p>WhoDrug ID: {concept.whodrug_id}</p>
        <p>ATC Code: {concept.atc_code}</p>
      </div>
    </div>
  );
};
