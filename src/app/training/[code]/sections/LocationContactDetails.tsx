import { LabelBox } from "@components/modules/LabelBox";
import { LinkObject } from "@components/modules/LinkObject";
import {
  GraduationCap,
  LinkSimpleHorizontal,
  MapPin,
  User,
} from "@phosphor-icons/react";
import { formatPhoneNumber } from "@utils/formatPhoneNumber";
import { TrainingProps } from "@utils/types";

export const LocationContactDetails = ({
  training,
  mobileOnly,
  desktopOnly,
}: {
  training: TrainingProps;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}) => {
  const providerAddress = `${training.provider.address.street1} ${
    training.provider.address.street2 ? training.provider.address.street2 : ""
  } ${training.provider.address.city}, ${training.provider.address.state} ${
    training.provider.address.zipCode ? training.provider.address.zipCode : ""
  }`;

  return (
    <LabelBox
      large
      subheading="Geographic and contact information for this Learning Opportunity"
      color="green"
      title="Location and Contact Details"
      className={`provider${mobileOnly ? " mobile-only" : ""}${
        desktopOnly ? " desktop-only" : ""
      }`}
    >
      <p>
        <GraduationCap size={18} weight="bold" />
        <span>{training.provider.name}</span>
      </p>
      <p>
        <MapPin size={18} weight="bold" />
        <span>
          <LinkObject
            noIndicator
            url={`https://www.google.com/maps/search/?api=1&query=${training.provider.name} ${providerAddress}`}
          >
            {training.provider.address.street1} <br />
            {training.provider.address.street2 ? (
              <>
                {training.provider.address.street2} <br />
              </>
            ) : (
              ""
            )}
            {training.provider.address.city}, {training.provider.address.state}{" "}
            {training.provider.address.zipCode}
          </LinkObject>
        </span>
      </p>
      <p>
        <User size={18} weight="bold" />
        <span>
          {training.provider.contactName} <br />
          {training.provider.contactTitle} <br />
          {formatPhoneNumber(training.provider.phoneNumber)}{" "}
          {training.provider.phoneExtension &&
            `Ext: ${training.provider.phoneExtension}`}
        </span>
      </p>
      <p>
        <LinkSimpleHorizontal size={18} weight="bold" />
        <span>
          <LinkObject noIndicator url={training.provider.url}>
            {training.provider.url}
          </LinkObject>
        </span>
      </p>
    </LabelBox>
  );
};
