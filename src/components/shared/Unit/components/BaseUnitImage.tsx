import React from "react";
import { cdnImage } from "../../../../data/cdnImage";

type BaseUnitImageProps = {
  urlColor: string;
  unitType: string;
  alt: string;
};

export function BaseUnitImage(props: BaseUnitImageProps): React.ReactElement {
  const { urlColor, unitType, alt } = props;
  return <img src={cdnImage(`/units/${urlColor}_${unitType}.png`)} alt={alt} />;
}
