import { db } from '@/db';
import { contracts } from '@reg/contracts';
import { devices } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';

type DeviceDetails = (typeof contracts.v1.UserContract)['device-details'];
type DeviceDetailsHandler = AppRouteImplementation<DeviceDetails>;

export const deviceDetailsHandler: DeviceDetailsHandler = async ({
  body: {
    deviceName,
    deviceType,
    deviceManufacturer,
    deviceOs,
    deviceOsVersion,
    deviceModel,
  },
  req: { userId },
}) => {
  // check if the user is authorized
  if (!userId) {
    return {
      status: 400 as 400,
      body: {
        status: 400,
        message: 'Not authorized!',
      },
    };
  }

  // save the device details
  const devicesTable = await db?.insert(devices).values({
    user: userId,
    name: deviceName,
    type: deviceType,
    manufacturer: deviceManufacturer,
    os: deviceOs,
    osVersion: deviceOsVersion,
    model: deviceModel,
  });

  // check if the device details are saved
  if (!devicesTable || devicesTable[0].affectedRows === 0) {
    return {
      status: 500 as 500,
      body: {
        status: 500,
        message: 'Internal Server Error!',
      },
    };
  }

  // return success
  return {
    status: 200 as 200,
    body: {
      status: 200,
      message: 'Device details saved successfully',
    },
  };
};
