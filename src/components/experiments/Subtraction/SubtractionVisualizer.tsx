interface Props {
  strA: string;
  strB: string;
}
const SubtractionVisualizer = ({ strA, strB }: Props) => {
  return (
    <div>
      {strA} - {strB}
    </div>
  );
};

export default SubtractionVisualizer;
