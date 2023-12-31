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

    const apiUrl = `${process.env.API_URL}/koda/${encodeURIComponent(reqBody.medication)}`;

    const lambdaResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await lambdaResponse.json();

    const responseBody = JSON.parse(responseData.body);

    const response: MedicationResponse = {
      concepts: responseBody.concepts,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    // Create a generic error response if the error is not an instance of Error
    let errorMessage = 'An error occurred';
    if (e instanceof Error) {
      errorMessage = e.message;
    }

    return new Response(errorMessage, { status: 400 });
  }
}
