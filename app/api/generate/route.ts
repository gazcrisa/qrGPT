import { MedicationRequest, MedicationResponse } from '@/utils/service';
import { NextRequest } from 'next/server';
// import { Ratelimit } from '@upstash/ratelimit';

/**
 * Validates a request object.
 *
 * @param {MedicationRequest} request - The request object to be validated.
 * @throws {Error} Error message if URL or prompt is missing.
 */

const validateRequest = (request: MedicationRequest) => {
  if (!request.medication) {
    throw new Error('Medication is required');
  }
};

// const ratelimit = new Ratelimit({
//   redis: kv,
//   // Allow 20 requests from the same IP in 1 day.
//   limiter: Ratelimit.slidingWindow(20, '1 d'),
// });

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as MedicationRequest;

  try {
    validateRequest(reqBody);

    const lambdaResponse = await fetch(
      'https://ivi7eyvgky3fyn6mmexgt4ac2y0fgbpo.lambda-url.us-east-1.on.aws/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medication: reqBody.medication }),
      },
    );


    const responseData = await lambdaResponse.json();


    const response: MedicationResponse = {
      concepts: responseData.RxNormConcepts,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }
}
