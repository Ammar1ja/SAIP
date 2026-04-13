import IPServicesSection from '@/components/organisms/IPServicesSection';
import {
  IP_LICENSING_SERVICES_NEW_DATA,
  IP_LICENSING_SERVICE_TYPE_OPTIONS,
  IP_LICENSING_TARGET_GROUP_OPTIONS,
} from '@/app/[locale]/services/ip-licensing/IpLicensingServices.data';

export default {
  title: 'Organisms/IPServicesSection',
  component: IPServicesSection,
};

export const Default = () => (
  <IPServicesSection
    title="IP licensing services"
    services={IP_LICENSING_SERVICES_NEW_DATA}
    serviceTypeOptions={IP_LICENSING_SERVICE_TYPE_OPTIONS}
    targetGroupOptions={IP_LICENSING_TARGET_GROUP_OPTIONS}
  />
);
