import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const ProblemScalarFieldEnumSchema = z.enum(['id','title','titleSlug','difficulty','questionId','createdAt','updatedAt']);

export const TagScalarFieldEnumSchema = z.enum(['id','name','slug','createdAt','updatedAt']);

export const ProblemTagScalarFieldEnumSchema = z.enum(['id','problemId','tagId','createdAt','updatedAt']);

export const ProficiencyScalarFieldEnumSchema = z.enum(['id','problemId','proficiency','lastSubmissionTime','nextReviewTime','isTracking','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// PROBLEM SCHEMA
/////////////////////////////////////////

export const ProblemSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Problem = z.infer<typeof ProblemSchema>

/////////////////////////////////////////
// TAG SCHEMA
/////////////////////////////////////////

export const TagSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Tag = z.infer<typeof TagSchema>

/////////////////////////////////////////
// PROBLEM TAG SCHEMA
/////////////////////////////////////////

export const ProblemTagSchema = z.object({
  id: z.number().int(),
  problemId: z.number().int(),
  tagId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ProblemTag = z.infer<typeof ProblemTagSchema>

/////////////////////////////////////////
// PROFICIENCY SCHEMA
/////////////////////////////////////////

export const ProficiencySchema = z.object({
  id: z.number().int(),
  problemId: z.number().int(),
  proficiency: z.number().int(),
  lastSubmissionTime: z.string(),
  nextReviewTime: z.string(),
  isTracking: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Proficiency = z.infer<typeof ProficiencySchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// PROBLEM
//------------------------------------------------------

export const ProblemIncludeSchema: z.ZodType<Prisma.ProblemInclude> = z.object({
  tags: z.union([z.boolean(),z.lazy(() => ProblemTagFindManyArgsSchema)]).optional(),
  proficiency: z.union([z.boolean(),z.lazy(() => ProficiencyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProblemCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProblemArgsSchema: z.ZodType<Prisma.ProblemDefaultArgs> = z.object({
  select: z.lazy(() => ProblemSelectSchema).optional(),
  include: z.lazy(() => ProblemIncludeSchema).optional(),
}).strict();

export const ProblemCountOutputTypeArgsSchema: z.ZodType<Prisma.ProblemCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProblemCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProblemCountOutputTypeSelectSchema: z.ZodType<Prisma.ProblemCountOutputTypeSelect> = z.object({
  tags: z.boolean().optional(),
}).strict();

export const ProblemSelectSchema: z.ZodType<Prisma.ProblemSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  titleSlug: z.boolean().optional(),
  difficulty: z.boolean().optional(),
  questionId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  tags: z.union([z.boolean(),z.lazy(() => ProblemTagFindManyArgsSchema)]).optional(),
  proficiency: z.union([z.boolean(),z.lazy(() => ProficiencyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProblemCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TAG
//------------------------------------------------------

export const TagIncludeSchema: z.ZodType<Prisma.TagInclude> = z.object({
  problems: z.union([z.boolean(),z.lazy(() => ProblemTagFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TagArgsSchema: z.ZodType<Prisma.TagDefaultArgs> = z.object({
  select: z.lazy(() => TagSelectSchema).optional(),
  include: z.lazy(() => TagIncludeSchema).optional(),
}).strict();

export const TagCountOutputTypeArgsSchema: z.ZodType<Prisma.TagCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TagCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TagCountOutputTypeSelectSchema: z.ZodType<Prisma.TagCountOutputTypeSelect> = z.object({
  problems: z.boolean().optional(),
}).strict();

export const TagSelectSchema: z.ZodType<Prisma.TagSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  problems: z.union([z.boolean(),z.lazy(() => ProblemTagFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROBLEM TAG
//------------------------------------------------------

export const ProblemTagIncludeSchema: z.ZodType<Prisma.ProblemTagInclude> = z.object({
  tag: z.union([z.boolean(),z.lazy(() => TagArgsSchema)]).optional(),
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
}).strict()

export const ProblemTagArgsSchema: z.ZodType<Prisma.ProblemTagDefaultArgs> = z.object({
  select: z.lazy(() => ProblemTagSelectSchema).optional(),
  include: z.lazy(() => ProblemTagIncludeSchema).optional(),
}).strict();

export const ProblemTagSelectSchema: z.ZodType<Prisma.ProblemTagSelect> = z.object({
  id: z.boolean().optional(),
  problemId: z.boolean().optional(),
  tagId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  tag: z.union([z.boolean(),z.lazy(() => TagArgsSchema)]).optional(),
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
}).strict()

// PROFICIENCY
//------------------------------------------------------

export const ProficiencyIncludeSchema: z.ZodType<Prisma.ProficiencyInclude> = z.object({
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
}).strict()

export const ProficiencyArgsSchema: z.ZodType<Prisma.ProficiencyDefaultArgs> = z.object({
  select: z.lazy(() => ProficiencySelectSchema).optional(),
  include: z.lazy(() => ProficiencyIncludeSchema).optional(),
}).strict();

export const ProficiencySelectSchema: z.ZodType<Prisma.ProficiencySelect> = z.object({
  id: z.boolean().optional(),
  problemId: z.boolean().optional(),
  proficiency: z.boolean().optional(),
  lastSubmissionTime: z.boolean().optional(),
  nextReviewTime: z.boolean().optional(),
  isTracking: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ProblemWhereInputSchema: z.ZodType<Prisma.ProblemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProblemWhereInputSchema),z.lazy(() => ProblemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemWhereInputSchema),z.lazy(() => ProblemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  titleSlug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  difficulty: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  questionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tags: z.lazy(() => ProblemTagListRelationFilterSchema).optional(),
  proficiency: z.union([ z.lazy(() => ProficiencyNullableScalarRelationFilterSchema),z.lazy(() => ProficiencyWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ProblemOrderByWithRelationInputSchema: z.ZodType<Prisma.ProblemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  titleSlug: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => ProblemTagOrderByRelationAggregateInputSchema).optional(),
  proficiency: z.lazy(() => ProficiencyOrderByWithRelationInputSchema).optional()
}).strict();

export const ProblemWhereUniqueInputSchema: z.ZodType<Prisma.ProblemWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    titleSlug: z.string(),
    questionId: z.string()
  }),
  z.object({
    id: z.number().int(),
    titleSlug: z.string(),
  }),
  z.object({
    id: z.number().int(),
    questionId: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    titleSlug: z.string(),
    questionId: z.string(),
  }),
  z.object({
    titleSlug: z.string(),
  }),
  z.object({
    questionId: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  titleSlug: z.string().optional(),
  questionId: z.string().optional(),
  AND: z.union([ z.lazy(() => ProblemWhereInputSchema),z.lazy(() => ProblemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemWhereInputSchema),z.lazy(() => ProblemWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  difficulty: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tags: z.lazy(() => ProblemTagListRelationFilterSchema).optional(),
  proficiency: z.union([ z.lazy(() => ProficiencyNullableScalarRelationFilterSchema),z.lazy(() => ProficiencyWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ProblemOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProblemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  titleSlug: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProblemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProblemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProblemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProblemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProblemSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProblemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProblemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema),z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema),z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  titleSlug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  difficulty: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  questionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TagWhereInputSchema: z.ZodType<Prisma.TagWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  problems: z.lazy(() => ProblemTagListRelationFilterSchema).optional()
}).strict();

export const TagOrderByWithRelationInputSchema: z.ZodType<Prisma.TagOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  problems: z.lazy(() => ProblemTagOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TagWhereUniqueInputSchema: z.ZodType<Prisma.TagWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string()
  }),
  z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  z.object({
    id: z.number().int(),
    slug: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    name: z.string(),
    slug: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    slug: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  problems: z.lazy(() => ProblemTagListRelationFilterSchema).optional()
}).strict());

export const TagOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TagCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TagAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TagMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TagMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TagSumOrderByAggregateInputSchema).optional()
}).strict();

export const TagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProblemTagWhereInputSchema: z.ZodType<Prisma.ProblemTagWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProblemTagWhereInputSchema),z.lazy(() => ProblemTagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemTagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemTagWhereInputSchema),z.lazy(() => ProblemTagWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tagId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tag: z.union([ z.lazy(() => TagScalarRelationFilterSchema),z.lazy(() => TagWhereInputSchema) ]).optional(),
  problem: z.union([ z.lazy(() => ProblemScalarRelationFilterSchema),z.lazy(() => ProblemWhereInputSchema) ]).optional(),
}).strict();

export const ProblemTagOrderByWithRelationInputSchema: z.ZodType<Prisma.ProblemTagOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => TagOrderByWithRelationInputSchema).optional(),
  problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional()
}).strict();

export const ProblemTagWhereUniqueInputSchema: z.ZodType<Prisma.ProblemTagWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    problemId_tagId: z.lazy(() => ProblemTagProblemIdTagIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    problemId_tagId: z.lazy(() => ProblemTagProblemIdTagIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  problemId_tagId: z.lazy(() => ProblemTagProblemIdTagIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ProblemTagWhereInputSchema),z.lazy(() => ProblemTagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemTagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemTagWhereInputSchema),z.lazy(() => ProblemTagWhereInputSchema).array() ]).optional(),
  problemId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  tagId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tag: z.union([ z.lazy(() => TagScalarRelationFilterSchema),z.lazy(() => TagWhereInputSchema) ]).optional(),
  problem: z.union([ z.lazy(() => ProblemScalarRelationFilterSchema),z.lazy(() => ProblemWhereInputSchema) ]).optional(),
}).strict());

export const ProblemTagOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProblemTagOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProblemTagCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProblemTagAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProblemTagMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProblemTagMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProblemTagSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProblemTagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProblemTagScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema),z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema),z.lazy(() => ProblemTagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  tagId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProficiencyWhereInputSchema: z.ZodType<Prisma.ProficiencyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProficiencyWhereInputSchema),z.lazy(() => ProficiencyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProficiencyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProficiencyWhereInputSchema),z.lazy(() => ProficiencyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  proficiency: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  lastSubmissionTime: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  nextReviewTime: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isTracking: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  problem: z.union([ z.lazy(() => ProblemScalarRelationFilterSchema),z.lazy(() => ProblemWhereInputSchema) ]).optional(),
}).strict();

export const ProficiencyOrderByWithRelationInputSchema: z.ZodType<Prisma.ProficiencyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  proficiency: z.lazy(() => SortOrderSchema).optional(),
  lastSubmissionTime: z.lazy(() => SortOrderSchema).optional(),
  nextReviewTime: z.lazy(() => SortOrderSchema).optional(),
  isTracking: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional()
}).strict();

export const ProficiencyWhereUniqueInputSchema: z.ZodType<Prisma.ProficiencyWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    problemId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    problemId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  problemId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProficiencyWhereInputSchema),z.lazy(() => ProficiencyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProficiencyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProficiencyWhereInputSchema),z.lazy(() => ProficiencyWhereInputSchema).array() ]).optional(),
  proficiency: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  lastSubmissionTime: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  nextReviewTime: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isTracking: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  problem: z.union([ z.lazy(() => ProblemScalarRelationFilterSchema),z.lazy(() => ProblemWhereInputSchema) ]).optional(),
}).strict());

export const ProficiencyOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProficiencyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  proficiency: z.lazy(() => SortOrderSchema).optional(),
  lastSubmissionTime: z.lazy(() => SortOrderSchema).optional(),
  nextReviewTime: z.lazy(() => SortOrderSchema).optional(),
  isTracking: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProficiencyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProficiencyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProficiencyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProficiencyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProficiencySumOrderByAggregateInputSchema).optional()
}).strict();

export const ProficiencyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProficiencyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProficiencyScalarWhereWithAggregatesInputSchema),z.lazy(() => ProficiencyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProficiencyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProficiencyScalarWhereWithAggregatesInputSchema),z.lazy(() => ProficiencyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  proficiency: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  lastSubmissionTime: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  nextReviewTime: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isTracking: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProblemCreateInputSchema: z.ZodType<Prisma.ProblemCreateInput> = z.object({
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => ProblemTagCreateNestedManyWithoutProblemInputSchema).optional(),
  proficiency: z.lazy(() => ProficiencyCreateNestedOneWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUncheckedCreateInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema).optional(),
  proficiency: z.lazy(() => ProficiencyUncheckedCreateNestedOneWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUpdateInputSchema: z.ZodType<Prisma.ProblemUpdateInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => ProblemTagUpdateManyWithoutProblemNestedInputSchema).optional(),
  proficiency: z.lazy(() => ProficiencyUpdateOneWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemUncheckedUpdateInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema).optional(),
  proficiency: z.lazy(() => ProficiencyUncheckedUpdateOneWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemCreateManyInputSchema: z.ZodType<Prisma.ProblemCreateManyInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProblemUpdateManyMutationInputSchema: z.ZodType<Prisma.ProblemUpdateManyMutationInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagCreateInputSchema: z.ZodType<Prisma.TagCreateInput> = z.object({
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  problems: z.lazy(() => ProblemTagCreateNestedManyWithoutTagInputSchema).optional()
}).strict();

export const TagUncheckedCreateInputSchema: z.ZodType<Prisma.TagUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  problems: z.lazy(() => ProblemTagUncheckedCreateNestedManyWithoutTagInputSchema).optional()
}).strict();

export const TagUpdateInputSchema: z.ZodType<Prisma.TagUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  problems: z.lazy(() => ProblemTagUpdateManyWithoutTagNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateInputSchema: z.ZodType<Prisma.TagUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  problems: z.lazy(() => ProblemTagUncheckedUpdateManyWithoutTagNestedInputSchema).optional()
}).strict();

export const TagCreateManyInputSchema: z.ZodType<Prisma.TagCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TagUpdateManyMutationInputSchema: z.ZodType<Prisma.TagUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemTagCreateInputSchema: z.ZodType<Prisma.ProblemTagCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tag: z.lazy(() => TagCreateNestedOneWithoutProblemsInputSchema),
  problem: z.lazy(() => ProblemCreateNestedOneWithoutTagsInputSchema)
}).strict();

export const ProblemTagUncheckedCreateInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int(),
  tagId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProblemTagUpdateInputSchema: z.ZodType<Prisma.ProblemTagUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.lazy(() => TagUpdateOneRequiredWithoutProblemsNestedInputSchema).optional(),
  problem: z.lazy(() => ProblemUpdateOneRequiredWithoutTagsNestedInputSchema).optional()
}).strict();

export const ProblemTagUncheckedUpdateInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tagId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemTagCreateManyInputSchema: z.ZodType<Prisma.ProblemTagCreateManyInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int(),
  tagId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProblemTagUpdateManyMutationInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemTagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tagId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProficiencyCreateInputSchema: z.ZodType<Prisma.ProficiencyCreateInput> = z.object({
  proficiency: z.number().int(),
  lastSubmissionTime: z.string(),
  nextReviewTime: z.string(),
  isTracking: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  problem: z.lazy(() => ProblemCreateNestedOneWithoutProficiencyInputSchema)
}).strict();

export const ProficiencyUncheckedCreateInputSchema: z.ZodType<Prisma.ProficiencyUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int(),
  proficiency: z.number().int(),
  lastSubmissionTime: z.string(),
  nextReviewTime: z.string(),
  isTracking: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProficiencyUpdateInputSchema: z.ZodType<Prisma.ProficiencyUpdateInput> = z.object({
  proficiency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lastSubmissionTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nextReviewTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isTracking: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  problem: z.lazy(() => ProblemUpdateOneRequiredWithoutProficiencyNestedInputSchema).optional()
}).strict();

export const ProficiencyUncheckedUpdateInputSchema: z.ZodType<Prisma.ProficiencyUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  proficiency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lastSubmissionTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nextReviewTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isTracking: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProficiencyCreateManyInputSchema: z.ZodType<Prisma.ProficiencyCreateManyInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int(),
  proficiency: z.number().int(),
  lastSubmissionTime: z.string(),
  nextReviewTime: z.string(),
  isTracking: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProficiencyUpdateManyMutationInputSchema: z.ZodType<Prisma.ProficiencyUpdateManyMutationInput> = z.object({
  proficiency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lastSubmissionTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nextReviewTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isTracking: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProficiencyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProficiencyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  proficiency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lastSubmissionTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nextReviewTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isTracking: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ProblemTagListRelationFilterSchema: z.ZodType<Prisma.ProblemTagListRelationFilter> = z.object({
  every: z.lazy(() => ProblemTagWhereInputSchema).optional(),
  some: z.lazy(() => ProblemTagWhereInputSchema).optional(),
  none: z.lazy(() => ProblemTagWhereInputSchema).optional()
}).strict();

export const ProficiencyNullableScalarRelationFilterSchema: z.ZodType<Prisma.ProficiencyNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ProficiencyWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProficiencyWhereInputSchema).optional().nullable()
}).strict();

export const ProblemTagOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProblemTagOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  titleSlug: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  titleSlug: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  titleSlug: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const TagCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TagAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagSumOrderByAggregateInputSchema: z.ZodType<Prisma.TagSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagScalarRelationFilterSchema: z.ZodType<Prisma.TagScalarRelationFilter> = z.object({
  is: z.lazy(() => TagWhereInputSchema).optional(),
  isNot: z.lazy(() => TagWhereInputSchema).optional()
}).strict();

export const ProblemScalarRelationFilterSchema: z.ZodType<Prisma.ProblemScalarRelationFilter> = z.object({
  is: z.lazy(() => ProblemWhereInputSchema).optional(),
  isNot: z.lazy(() => ProblemWhereInputSchema).optional()
}).strict();

export const ProblemTagProblemIdTagIdCompoundUniqueInputSchema: z.ZodType<Prisma.ProblemTagProblemIdTagIdCompoundUniqueInput> = z.object({
  problemId: z.number(),
  tagId: z.number()
}).strict();

export const ProblemTagCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemTagAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemTagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemTagMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemTagSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemTagSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  tagId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const ProficiencyCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProficiencyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  proficiency: z.lazy(() => SortOrderSchema).optional(),
  lastSubmissionTime: z.lazy(() => SortOrderSchema).optional(),
  nextReviewTime: z.lazy(() => SortOrderSchema).optional(),
  isTracking: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProficiencyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProficiencyAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  proficiency: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProficiencyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProficiencyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  proficiency: z.lazy(() => SortOrderSchema).optional(),
  lastSubmissionTime: z.lazy(() => SortOrderSchema).optional(),
  nextReviewTime: z.lazy(() => SortOrderSchema).optional(),
  isTracking: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProficiencyMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProficiencyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  proficiency: z.lazy(() => SortOrderSchema).optional(),
  lastSubmissionTime: z.lazy(() => SortOrderSchema).optional(),
  nextReviewTime: z.lazy(() => SortOrderSchema).optional(),
  isTracking: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProficiencySumOrderByAggregateInputSchema: z.ZodType<Prisma.ProficiencySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  proficiency: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const ProblemTagCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateNestedManyWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProficiencyCreateNestedOneWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyCreateNestedOneWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => ProficiencyCreateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedCreateWithoutProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProficiencyCreateOrConnectWithoutProblemInputSchema).optional(),
  connect: z.lazy(() => ProficiencyWhereUniqueInputSchema).optional()
}).strict();

export const ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateNestedManyWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProficiencyUncheckedCreateNestedOneWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyUncheckedCreateNestedOneWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => ProficiencyCreateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedCreateWithoutProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProficiencyCreateOrConnectWithoutProblemInputSchema).optional(),
  connect: z.lazy(() => ProficiencyWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ProblemTagUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema),z.lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProblemTagScalarWhereInputSchema),z.lazy(() => ProblemTagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProficiencyUpdateOneWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProficiencyUpdateOneWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProficiencyCreateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedCreateWithoutProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProficiencyCreateOrConnectWithoutProblemInputSchema).optional(),
  upsert: z.lazy(() => ProficiencyUpsertWithoutProblemInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProficiencyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProficiencyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProficiencyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProficiencyUpdateToOneWithWhereWithoutProblemInputSchema),z.lazy(() => ProficiencyUpdateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedUpdateWithoutProblemInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateWithoutProblemInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyProblemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema),z.lazy(() => ProblemTagUpdateManyWithWhereWithoutProblemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProblemTagScalarWhereInputSchema),z.lazy(() => ProblemTagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProficiencyUncheckedUpdateOneWithoutProblemNestedInputSchema: z.ZodType<Prisma.ProficiencyUncheckedUpdateOneWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProficiencyCreateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedCreateWithoutProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProficiencyCreateOrConnectWithoutProblemInputSchema).optional(),
  upsert: z.lazy(() => ProficiencyUpsertWithoutProblemInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProficiencyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProficiencyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProficiencyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProficiencyUpdateToOneWithWhereWithoutProblemInputSchema),z.lazy(() => ProficiencyUpdateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedUpdateWithoutProblemInputSchema) ]).optional(),
}).strict();

export const ProblemTagCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagCreateNestedManyWithoutTagInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutTagInputSchema),z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProblemTagUncheckedCreateNestedManyWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateNestedManyWithoutTagInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutTagInputSchema),z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProblemTagUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithoutTagNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutTagInputSchema),z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema),z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema),z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema),z.lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProblemTagScalarWhereInputSchema),z.lazy(() => ProblemTagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProblemTagUncheckedUpdateManyWithoutTagNestedInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutTagNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutTagInputSchema),z.lazy(() => ProblemTagCreateWithoutTagInputSchema).array(),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema),z.lazy(() => ProblemTagCreateOrConnectWithoutTagInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema),z.lazy(() => ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProblemTagCreateManyTagInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProblemTagWhereUniqueInputSchema),z.lazy(() => ProblemTagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema),z.lazy(() => ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema),z.lazy(() => ProblemTagUpdateManyWithWhereWithoutTagInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProblemTagScalarWhereInputSchema),z.lazy(() => ProblemTagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TagCreateNestedOneWithoutProblemsInputSchema: z.ZodType<Prisma.TagCreateNestedOneWithoutProblemsInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutProblemsInputSchema),z.lazy(() => TagUncheckedCreateWithoutProblemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutProblemsInputSchema).optional(),
  connect: z.lazy(() => TagWhereUniqueInputSchema).optional()
}).strict();

export const ProblemCreateNestedOneWithoutTagsInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutTagsInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutTagsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutTagsInputSchema).optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional()
}).strict();

export const TagUpdateOneRequiredWithoutProblemsNestedInputSchema: z.ZodType<Prisma.TagUpdateOneRequiredWithoutProblemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutProblemsInputSchema),z.lazy(() => TagUncheckedCreateWithoutProblemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutProblemsInputSchema).optional(),
  upsert: z.lazy(() => TagUpsertWithoutProblemsInputSchema).optional(),
  connect: z.lazy(() => TagWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TagUpdateToOneWithWhereWithoutProblemsInputSchema),z.lazy(() => TagUpdateWithoutProblemsInputSchema),z.lazy(() => TagUncheckedUpdateWithoutProblemsInputSchema) ]).optional(),
}).strict();

export const ProblemUpdateOneRequiredWithoutTagsNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutTagsInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutTagsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutTagsInputSchema).optional(),
  upsert: z.lazy(() => ProblemUpsertWithoutTagsInputSchema).optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProblemUpdateToOneWithWhereWithoutTagsInputSchema),z.lazy(() => ProblemUpdateWithoutTagsInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutTagsInputSchema) ]).optional(),
}).strict();

export const ProblemCreateNestedOneWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutProficiencyInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutProficiencyInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutProficiencyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutProficiencyInputSchema).optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const ProblemUpdateOneRequiredWithoutProficiencyNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutProficiencyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutProficiencyInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutProficiencyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutProficiencyInputSchema).optional(),
  upsert: z.lazy(() => ProblemUpsertWithoutProficiencyInputSchema).optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProblemUpdateToOneWithWhereWithoutProficiencyInputSchema),z.lazy(() => ProblemUpdateWithoutProficiencyInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutProficiencyInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const ProblemTagCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateWithoutProblemInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tag: z.lazy(() => TagCreateNestedOneWithoutProblemsInputSchema)
}).strict();

export const ProblemTagUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateWithoutProblemInput> = z.object({
  id: z.number().int().optional(),
  tagId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProblemTagCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateOrConnectWithoutProblemInput> = z.object({
  where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema) ]),
}).strict();

export const ProblemTagCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.ProblemTagCreateManyProblemInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProblemTagCreateManyProblemInputSchema),z.lazy(() => ProblemTagCreateManyProblemInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProficiencyCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyCreateWithoutProblemInput> = z.object({
  proficiency: z.number().int(),
  lastSubmissionTime: z.string(),
  nextReviewTime: z.string(),
  isTracking: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProficiencyUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyUncheckedCreateWithoutProblemInput> = z.object({
  id: z.number().int().optional(),
  proficiency: z.number().int(),
  lastSubmissionTime: z.string(),
  nextReviewTime: z.string(),
  isTracking: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProficiencyCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyCreateOrConnectWithoutProblemInput> = z.object({
  where: z.lazy(() => ProficiencyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProficiencyCreateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedCreateWithoutProblemInputSchema) ]),
}).strict();

export const ProblemTagUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpsertWithWhereUniqueWithoutProblemInput> = z.object({
  where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProblemTagUpdateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedUpdateWithoutProblemInputSchema) ]),
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutProblemInputSchema) ]),
}).strict();

export const ProblemTagUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithWhereUniqueWithoutProblemInput> = z.object({
  where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProblemTagUpdateWithoutProblemInputSchema),z.lazy(() => ProblemTagUncheckedUpdateWithoutProblemInputSchema) ]),
}).strict();

export const ProblemTagUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithWhereWithoutProblemInput> = z.object({
  where: z.lazy(() => ProblemTagScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProblemTagUpdateManyMutationInputSchema),z.lazy(() => ProblemTagUncheckedUpdateManyWithoutProblemInputSchema) ]),
}).strict();

export const ProblemTagScalarWhereInputSchema: z.ZodType<Prisma.ProblemTagScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProblemTagScalarWhereInputSchema),z.lazy(() => ProblemTagScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemTagScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemTagScalarWhereInputSchema),z.lazy(() => ProblemTagScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tagId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProficiencyUpsertWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyUpsertWithoutProblemInput> = z.object({
  update: z.union([ z.lazy(() => ProficiencyUpdateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedUpdateWithoutProblemInputSchema) ]),
  create: z.union([ z.lazy(() => ProficiencyCreateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedCreateWithoutProblemInputSchema) ]),
  where: z.lazy(() => ProficiencyWhereInputSchema).optional()
}).strict();

export const ProficiencyUpdateToOneWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyUpdateToOneWithWhereWithoutProblemInput> = z.object({
  where: z.lazy(() => ProficiencyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProficiencyUpdateWithoutProblemInputSchema),z.lazy(() => ProficiencyUncheckedUpdateWithoutProblemInputSchema) ]),
}).strict();

export const ProficiencyUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyUpdateWithoutProblemInput> = z.object({
  proficiency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lastSubmissionTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nextReviewTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isTracking: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProficiencyUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProficiencyUncheckedUpdateWithoutProblemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  proficiency: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lastSubmissionTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nextReviewTime: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isTracking: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemTagCreateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagCreateWithoutTagInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  problem: z.lazy(() => ProblemCreateNestedOneWithoutTagsInputSchema)
}).strict();

export const ProblemTagUncheckedCreateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedCreateWithoutTagInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProblemTagCreateOrConnectWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagCreateOrConnectWithoutTagInput> = z.object({
  where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema) ]),
}).strict();

export const ProblemTagCreateManyTagInputEnvelopeSchema: z.ZodType<Prisma.ProblemTagCreateManyTagInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProblemTagCreateManyTagInputSchema),z.lazy(() => ProblemTagCreateManyTagInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProblemTagUpsertWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpsertWithWhereUniqueWithoutTagInput> = z.object({
  where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProblemTagUpdateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedUpdateWithoutTagInputSchema) ]),
  create: z.union([ z.lazy(() => ProblemTagCreateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedCreateWithoutTagInputSchema) ]),
}).strict();

export const ProblemTagUpdateWithWhereUniqueWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithWhereUniqueWithoutTagInput> = z.object({
  where: z.lazy(() => ProblemTagWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProblemTagUpdateWithoutTagInputSchema),z.lazy(() => ProblemTagUncheckedUpdateWithoutTagInputSchema) ]),
}).strict();

export const ProblemTagUpdateManyWithWhereWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpdateManyWithWhereWithoutTagInput> = z.object({
  where: z.lazy(() => ProblemTagScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProblemTagUpdateManyMutationInputSchema),z.lazy(() => ProblemTagUncheckedUpdateManyWithoutTagInputSchema) ]),
}).strict();

export const TagCreateWithoutProblemsInputSchema: z.ZodType<Prisma.TagCreateWithoutProblemsInput> = z.object({
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TagUncheckedCreateWithoutProblemsInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutProblemsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TagCreateOrConnectWithoutProblemsInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutProblemsInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagCreateWithoutProblemsInputSchema),z.lazy(() => TagUncheckedCreateWithoutProblemsInputSchema) ]),
}).strict();

export const ProblemCreateWithoutTagsInputSchema: z.ZodType<Prisma.ProblemCreateWithoutTagsInput> = z.object({
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proficiency: z.lazy(() => ProficiencyCreateNestedOneWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutTagsInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  proficiency: z.lazy(() => ProficiencyUncheckedCreateNestedOneWithoutProblemInputSchema).optional()
}).strict();

export const ProblemCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => ProblemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProblemCreateWithoutTagsInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const TagUpsertWithoutProblemsInputSchema: z.ZodType<Prisma.TagUpsertWithoutProblemsInput> = z.object({
  update: z.union([ z.lazy(() => TagUpdateWithoutProblemsInputSchema),z.lazy(() => TagUncheckedUpdateWithoutProblemsInputSchema) ]),
  create: z.union([ z.lazy(() => TagCreateWithoutProblemsInputSchema),z.lazy(() => TagUncheckedCreateWithoutProblemsInputSchema) ]),
  where: z.lazy(() => TagWhereInputSchema).optional()
}).strict();

export const TagUpdateToOneWithWhereWithoutProblemsInputSchema: z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutProblemsInput> = z.object({
  where: z.lazy(() => TagWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TagUpdateWithoutProblemsInputSchema),z.lazy(() => TagUncheckedUpdateWithoutProblemsInputSchema) ]),
}).strict();

export const TagUpdateWithoutProblemsInputSchema: z.ZodType<Prisma.TagUpdateWithoutProblemsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUncheckedUpdateWithoutProblemsInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutProblemsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemUpsertWithoutTagsInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutTagsInput> = z.object({
  update: z.union([ z.lazy(() => ProblemUpdateWithoutTagsInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutTagsInputSchema) ]),
  create: z.union([ z.lazy(() => ProblemCreateWithoutTagsInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutTagsInputSchema) ]),
  where: z.lazy(() => ProblemWhereInputSchema).optional()
}).strict();

export const ProblemUpdateToOneWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.ProblemUpdateToOneWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => ProblemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProblemUpdateWithoutTagsInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutTagsInputSchema) ]),
}).strict();

export const ProblemUpdateWithoutTagsInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutTagsInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proficiency: z.lazy(() => ProficiencyUpdateOneWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  proficiency: z.lazy(() => ProficiencyUncheckedUpdateOneWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemCreateWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemCreateWithoutProficiencyInput> = z.object({
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => ProblemTagCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUncheckedCreateWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutProficiencyInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  titleSlug: z.string(),
  difficulty: z.string(),
  questionId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => ProblemTagUncheckedCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemCreateOrConnectWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutProficiencyInput> = z.object({
  where: z.lazy(() => ProblemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProblemCreateWithoutProficiencyInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutProficiencyInputSchema) ]),
}).strict();

export const ProblemUpsertWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutProficiencyInput> = z.object({
  update: z.union([ z.lazy(() => ProblemUpdateWithoutProficiencyInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutProficiencyInputSchema) ]),
  create: z.union([ z.lazy(() => ProblemCreateWithoutProficiencyInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutProficiencyInputSchema) ]),
  where: z.lazy(() => ProblemWhereInputSchema).optional()
}).strict();

export const ProblemUpdateToOneWithWhereWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemUpdateToOneWithWhereWithoutProficiencyInput> = z.object({
  where: z.lazy(() => ProblemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProblemUpdateWithoutProficiencyInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutProficiencyInputSchema) ]),
}).strict();

export const ProblemUpdateWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutProficiencyInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => ProblemTagUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemUncheckedUpdateWithoutProficiencyInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutProficiencyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  titleSlug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  difficulty: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => ProblemTagUncheckedUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemTagCreateManyProblemInputSchema: z.ZodType<Prisma.ProblemTagCreateManyProblemInput> = z.object({
  id: z.number().int().optional(),
  tagId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProblemTagUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithoutProblemInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.lazy(() => TagUpdateOneRequiredWithoutProblemsNestedInputSchema).optional()
}).strict();

export const ProblemTagUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateWithoutProblemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tagId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemTagUncheckedUpdateManyWithoutProblemInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutProblemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tagId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemTagCreateManyTagInputSchema: z.ZodType<Prisma.ProblemTagCreateManyTagInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProblemTagUpdateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUpdateWithoutTagInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  problem: z.lazy(() => ProblemUpdateOneRequiredWithoutTagsNestedInputSchema).optional()
}).strict();

export const ProblemTagUncheckedUpdateWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateWithoutTagInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemTagUncheckedUpdateManyWithoutTagInputSchema: z.ZodType<Prisma.ProblemTagUncheckedUpdateManyWithoutTagInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ProblemFindFirstArgsSchema: z.ZodType<Prisma.ProblemFindFirstArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProblemScalarFieldEnumSchema,ProblemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProblemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProblemFindFirstOrThrowArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProblemScalarFieldEnumSchema,ProblemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProblemFindManyArgsSchema: z.ZodType<Prisma.ProblemFindManyArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProblemScalarFieldEnumSchema,ProblemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProblemAggregateArgsSchema: z.ZodType<Prisma.ProblemAggregateArgs> = z.object({
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProblemGroupByArgsSchema: z.ZodType<Prisma.ProblemGroupByArgs> = z.object({
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithAggregationInputSchema.array(),ProblemOrderByWithAggregationInputSchema ]).optional(),
  by: ProblemScalarFieldEnumSchema.array(),
  having: ProblemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProblemFindUniqueArgsSchema: z.ZodType<Prisma.ProblemFindUniqueArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
}).strict() ;

export const ProblemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProblemFindUniqueOrThrowArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
}).strict() ;

export const TagFindFirstArgsSchema: z.ZodType<Prisma.TagFindFirstArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagFindFirstOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagFindManyArgsSchema: z.ZodType<Prisma.TagFindManyArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagAggregateArgsSchema: z.ZodType<Prisma.TagAggregateArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagGroupByArgsSchema: z.ZodType<Prisma.TagGroupByArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithAggregationInputSchema.array(),TagOrderByWithAggregationInputSchema ]).optional(),
  by: TagScalarFieldEnumSchema.array(),
  having: TagScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagFindUniqueArgsSchema: z.ZodType<Prisma.TagFindUniqueArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagFindUniqueOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const ProblemTagFindFirstArgsSchema: z.ZodType<Prisma.ProblemTagFindFirstArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  where: ProblemTagWhereInputSchema.optional(),
  orderBy: z.union([ ProblemTagOrderByWithRelationInputSchema.array(),ProblemTagOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemTagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProblemTagScalarFieldEnumSchema,ProblemTagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProblemTagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProblemTagFindFirstOrThrowArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  where: ProblemTagWhereInputSchema.optional(),
  orderBy: z.union([ ProblemTagOrderByWithRelationInputSchema.array(),ProblemTagOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemTagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProblemTagScalarFieldEnumSchema,ProblemTagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProblemTagFindManyArgsSchema: z.ZodType<Prisma.ProblemTagFindManyArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  where: ProblemTagWhereInputSchema.optional(),
  orderBy: z.union([ ProblemTagOrderByWithRelationInputSchema.array(),ProblemTagOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemTagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProblemTagScalarFieldEnumSchema,ProblemTagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProblemTagAggregateArgsSchema: z.ZodType<Prisma.ProblemTagAggregateArgs> = z.object({
  where: ProblemTagWhereInputSchema.optional(),
  orderBy: z.union([ ProblemTagOrderByWithRelationInputSchema.array(),ProblemTagOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemTagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProblemTagGroupByArgsSchema: z.ZodType<Prisma.ProblemTagGroupByArgs> = z.object({
  where: ProblemTagWhereInputSchema.optional(),
  orderBy: z.union([ ProblemTagOrderByWithAggregationInputSchema.array(),ProblemTagOrderByWithAggregationInputSchema ]).optional(),
  by: ProblemTagScalarFieldEnumSchema.array(),
  having: ProblemTagScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProblemTagFindUniqueArgsSchema: z.ZodType<Prisma.ProblemTagFindUniqueArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  where: ProblemTagWhereUniqueInputSchema,
}).strict() ;

export const ProblemTagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProblemTagFindUniqueOrThrowArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  where: ProblemTagWhereUniqueInputSchema,
}).strict() ;

export const ProficiencyFindFirstArgsSchema: z.ZodType<Prisma.ProficiencyFindFirstArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  where: ProficiencyWhereInputSchema.optional(),
  orderBy: z.union([ ProficiencyOrderByWithRelationInputSchema.array(),ProficiencyOrderByWithRelationInputSchema ]).optional(),
  cursor: ProficiencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProficiencyScalarFieldEnumSchema,ProficiencyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProficiencyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProficiencyFindFirstOrThrowArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  where: ProficiencyWhereInputSchema.optional(),
  orderBy: z.union([ ProficiencyOrderByWithRelationInputSchema.array(),ProficiencyOrderByWithRelationInputSchema ]).optional(),
  cursor: ProficiencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProficiencyScalarFieldEnumSchema,ProficiencyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProficiencyFindManyArgsSchema: z.ZodType<Prisma.ProficiencyFindManyArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  where: ProficiencyWhereInputSchema.optional(),
  orderBy: z.union([ ProficiencyOrderByWithRelationInputSchema.array(),ProficiencyOrderByWithRelationInputSchema ]).optional(),
  cursor: ProficiencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProficiencyScalarFieldEnumSchema,ProficiencyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProficiencyAggregateArgsSchema: z.ZodType<Prisma.ProficiencyAggregateArgs> = z.object({
  where: ProficiencyWhereInputSchema.optional(),
  orderBy: z.union([ ProficiencyOrderByWithRelationInputSchema.array(),ProficiencyOrderByWithRelationInputSchema ]).optional(),
  cursor: ProficiencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProficiencyGroupByArgsSchema: z.ZodType<Prisma.ProficiencyGroupByArgs> = z.object({
  where: ProficiencyWhereInputSchema.optional(),
  orderBy: z.union([ ProficiencyOrderByWithAggregationInputSchema.array(),ProficiencyOrderByWithAggregationInputSchema ]).optional(),
  by: ProficiencyScalarFieldEnumSchema.array(),
  having: ProficiencyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProficiencyFindUniqueArgsSchema: z.ZodType<Prisma.ProficiencyFindUniqueArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  where: ProficiencyWhereUniqueInputSchema,
}).strict() ;

export const ProficiencyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProficiencyFindUniqueOrThrowArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  where: ProficiencyWhereUniqueInputSchema,
}).strict() ;

export const ProblemCreateArgsSchema: z.ZodType<Prisma.ProblemCreateArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  data: z.union([ ProblemCreateInputSchema,ProblemUncheckedCreateInputSchema ]),
}).strict() ;

export const ProblemUpsertArgsSchema: z.ZodType<Prisma.ProblemUpsertArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
  create: z.union([ ProblemCreateInputSchema,ProblemUncheckedCreateInputSchema ]),
  update: z.union([ ProblemUpdateInputSchema,ProblemUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProblemCreateManyArgsSchema: z.ZodType<Prisma.ProblemCreateManyArgs> = z.object({
  data: z.union([ ProblemCreateManyInputSchema,ProblemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProblemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProblemCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProblemCreateManyInputSchema,ProblemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProblemDeleteArgsSchema: z.ZodType<Prisma.ProblemDeleteArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
}).strict() ;

export const ProblemUpdateArgsSchema: z.ZodType<Prisma.ProblemUpdateArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  data: z.union([ ProblemUpdateInputSchema,ProblemUncheckedUpdateInputSchema ]),
  where: ProblemWhereUniqueInputSchema,
}).strict() ;

export const ProblemUpdateManyArgsSchema: z.ZodType<Prisma.ProblemUpdateManyArgs> = z.object({
  data: z.union([ ProblemUpdateManyMutationInputSchema,ProblemUncheckedUpdateManyInputSchema ]),
  where: ProblemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyProblemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyProblemCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProblemUpdateManyMutationInputSchema,ProblemUncheckedUpdateManyInputSchema ]),
  where: ProblemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProblemDeleteManyArgsSchema: z.ZodType<Prisma.ProblemDeleteManyArgs> = z.object({
  where: ProblemWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TagCreateArgsSchema: z.ZodType<Prisma.TagCreateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
}).strict() ;

export const TagUpsertArgsSchema: z.ZodType<Prisma.TagUpsertArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
  create: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
  update: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
}).strict() ;

export const TagCreateManyArgsSchema: z.ZodType<Prisma.TagCreateManyArgs> = z.object({
  data: z.union([ TagCreateManyInputSchema,TagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TagCreateManyAndReturnArgs> = z.object({
  data: z.union([ TagCreateManyInputSchema,TagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TagDeleteArgsSchema: z.ZodType<Prisma.TagDeleteArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagUpdateArgsSchema: z.ZodType<Prisma.TagUpdateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagUpdateManyArgsSchema: z.ZodType<Prisma.TagUpdateManyArgs> = z.object({
  data: z.union([ TagUpdateManyMutationInputSchema,TagUncheckedUpdateManyInputSchema ]),
  where: TagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyTagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyTagCreateManyAndReturnArgs> = z.object({
  data: z.union([ TagUpdateManyMutationInputSchema,TagUncheckedUpdateManyInputSchema ]),
  where: TagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TagDeleteManyArgsSchema: z.ZodType<Prisma.TagDeleteManyArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProblemTagCreateArgsSchema: z.ZodType<Prisma.ProblemTagCreateArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  data: z.union([ ProblemTagCreateInputSchema,ProblemTagUncheckedCreateInputSchema ]),
}).strict() ;

export const ProblemTagUpsertArgsSchema: z.ZodType<Prisma.ProblemTagUpsertArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  where: ProblemTagWhereUniqueInputSchema,
  create: z.union([ ProblemTagCreateInputSchema,ProblemTagUncheckedCreateInputSchema ]),
  update: z.union([ ProblemTagUpdateInputSchema,ProblemTagUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProblemTagCreateManyArgsSchema: z.ZodType<Prisma.ProblemTagCreateManyArgs> = z.object({
  data: z.union([ ProblemTagCreateManyInputSchema,ProblemTagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProblemTagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProblemTagCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProblemTagCreateManyInputSchema,ProblemTagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProblemTagDeleteArgsSchema: z.ZodType<Prisma.ProblemTagDeleteArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  where: ProblemTagWhereUniqueInputSchema,
}).strict() ;

export const ProblemTagUpdateArgsSchema: z.ZodType<Prisma.ProblemTagUpdateArgs> = z.object({
  select: ProblemTagSelectSchema.optional(),
  include: ProblemTagIncludeSchema.optional(),
  data: z.union([ ProblemTagUpdateInputSchema,ProblemTagUncheckedUpdateInputSchema ]),
  where: ProblemTagWhereUniqueInputSchema,
}).strict() ;

export const ProblemTagUpdateManyArgsSchema: z.ZodType<Prisma.ProblemTagUpdateManyArgs> = z.object({
  data: z.union([ ProblemTagUpdateManyMutationInputSchema,ProblemTagUncheckedUpdateManyInputSchema ]),
  where: ProblemTagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyProblemTagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyProblemTagCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProblemTagUpdateManyMutationInputSchema,ProblemTagUncheckedUpdateManyInputSchema ]),
  where: ProblemTagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProblemTagDeleteManyArgsSchema: z.ZodType<Prisma.ProblemTagDeleteManyArgs> = z.object({
  where: ProblemTagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProficiencyCreateArgsSchema: z.ZodType<Prisma.ProficiencyCreateArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  data: z.union([ ProficiencyCreateInputSchema,ProficiencyUncheckedCreateInputSchema ]),
}).strict() ;

export const ProficiencyUpsertArgsSchema: z.ZodType<Prisma.ProficiencyUpsertArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  where: ProficiencyWhereUniqueInputSchema,
  create: z.union([ ProficiencyCreateInputSchema,ProficiencyUncheckedCreateInputSchema ]),
  update: z.union([ ProficiencyUpdateInputSchema,ProficiencyUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProficiencyCreateManyArgsSchema: z.ZodType<Prisma.ProficiencyCreateManyArgs> = z.object({
  data: z.union([ ProficiencyCreateManyInputSchema,ProficiencyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProficiencyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProficiencyCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProficiencyCreateManyInputSchema,ProficiencyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProficiencyDeleteArgsSchema: z.ZodType<Prisma.ProficiencyDeleteArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  where: ProficiencyWhereUniqueInputSchema,
}).strict() ;

export const ProficiencyUpdateArgsSchema: z.ZodType<Prisma.ProficiencyUpdateArgs> = z.object({
  select: ProficiencySelectSchema.optional(),
  include: ProficiencyIncludeSchema.optional(),
  data: z.union([ ProficiencyUpdateInputSchema,ProficiencyUncheckedUpdateInputSchema ]),
  where: ProficiencyWhereUniqueInputSchema,
}).strict() ;

export const ProficiencyUpdateManyArgsSchema: z.ZodType<Prisma.ProficiencyUpdateManyArgs> = z.object({
  data: z.union([ ProficiencyUpdateManyMutationInputSchema,ProficiencyUncheckedUpdateManyInputSchema ]),
  where: ProficiencyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyProficiencyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyProficiencyCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProficiencyUpdateManyMutationInputSchema,ProficiencyUncheckedUpdateManyInputSchema ]),
  where: ProficiencyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ProficiencyDeleteManyArgsSchema: z.ZodType<Prisma.ProficiencyDeleteManyArgs> = z.object({
  where: ProficiencyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;