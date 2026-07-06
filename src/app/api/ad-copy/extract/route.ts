import { NextResponse } from "next/server";

import { extractAdvertisementTextFromImage } from "../../../../services/adImageExtraction";
import {
  LARGE_AD_IMAGE_MESSAGE,
  MAX_AD_IMAGE_BYTES,
  getAdImageValidationMessage,
} from "../../../../services/adImageValidation";

type ServiceError = Error & {
  statusCode?: number;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const adImage = formData.get("adImage");

    if (!(adImage instanceof File)) {
      return NextResponse.json(
        { error: "Please choose an advertisement screenshot." },
        { status: 400 }
      );
    }

    if (adImage.size > MAX_AD_IMAGE_BYTES) {
      return NextResponse.json(
        { error: LARGE_AD_IMAGE_MESSAGE },
        { status: 413 }
      );
    }

    const validationMessage = getAdImageValidationMessage(adImage);

    if (validationMessage) {
      return NextResponse.json({ error: validationMessage }, { status: 400 });
    }

    const adCopyText = await extractAdvertisementTextFromImage(adImage);

    return NextResponse.json(
      {
        text: adCopyText,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      const statusCode =
        typeof (error as ServiceError).statusCode === "number"
          ? (error as ServiceError).statusCode
          : 500;

      return NextResponse.json(
        {
          error:
            statusCode === 500
              ? "Unable to extract text from the screenshot."
              : error.message,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: "Unable to extract text from the screenshot." },
      { status: 500 }
    );
  }
}
