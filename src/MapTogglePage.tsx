import NewMapUI from "./NewMapUI";

type Props = {
  pannable?: boolean;
};

export default function MapTogglePage({ pannable }: Props) {
  return <NewMapUI pannable={pannable} />;
}
