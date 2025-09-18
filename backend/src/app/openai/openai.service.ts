import { DB } from '@/database/db';
import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(@Inject('DATABASE') private readonly db: Kysely<DB>) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generate() {
    const readingMat = await this.db
      .selectFrom('public.reading_materials')
      .select(['title', 'content'])
      .executeTakeFirst();

    console.log('Reading Material: ', readingMat.title);
    // return readingMat;
    return await this.generateChoices(readingMat.content);
  }

  async generateChoices(story: string) {
    console.log(story);
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a Choices game generator. Always respond in JSON following the schema.',
        },
        {
          role: 'user',
          content: `generate choices game for the passage that im going to send you\n

                    the passage contains a minigame flag that looks like this 
                    $MINIGAME_#$ the # signifies the index of minigame \n

                    generate a choices game per part_num. \n

                    the choices game you will generate should be context-based on the passages before each flag. \n

                    this is the story: \n
                    ${story}
                    `,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'story_questions_schema',
          schema: {
            type: 'object',
            properties: {
              choicesGame: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    part_num: { type: 'integer' },
                    question: { type: 'string' },
                    choices: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          choice: { type: 'string' },
                          answer: { type: 'boolean' },
                        },
                        required: ['choice', 'answer'],
                        additionalProperties: false,
                      },
                    },
                    explanation: { type: 'string' },
                  },
                  required: ['part_num', 'question', 'choices', 'explanation'],
                  additionalProperties: false,
                },
              },
            },
            required: ['choicesGame'],
            additionalProperties: false,
          },
        },
      },
    });

    console.log(response);
    return {
      generated: JSON.parse(response.choices[0].message?.content ?? '[]'),
    };
  }
}
