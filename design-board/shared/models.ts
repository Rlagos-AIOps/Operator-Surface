export type AgentModelName = keyof typeof AGENT_MODEL_DEFINITIONS
export type AgentModelProvider = 'openai' | 'anthropic' | 'google' | 'minimax'

export interface AgentModelDefinition {
	name: AgentModelName
	id: string
	provider: AgentModelProvider

	// Overrides the default thinking behavior for that provider
	thinking?: boolean
}

export const AGENT_MODEL_DEFINITIONS = {
	// Anthropic models
	// sonnet 4.5 is recommended
	'claude-sonnet-4-5': {
		name: 'claude-sonnet-4-5',
		id: 'claude-sonnet-4-5',
		provider: 'anthropic',
	},

	'claude-opus-4-5': {
		name: 'claude-opus-4-5',
		id: 'claude-opus-4-5',
		provider: 'anthropic',
	},

	// Google models
	'gemini-3-pro-preview': {
		name: 'gemini-3-pro-preview',
		id: 'gemini-3-pro-preview',
		provider: 'google',
		thinking: true,
	},

	// gemini 3 flash is fastest, and quite good
	'gemini-3-flash-preview': {
		name: 'gemini-3-flash-preview',
		id: 'gemini-3-flash-preview',
		provider: 'google',
	},

	// OpenAI models
	'gpt-5.2-2025-12-11': {
		name: 'gpt-5.2-2025-12-11',
		id: 'gpt-5.2-2025-12-11',
		provider: 'openai',
	},

	// MiniMax (OpenAI-compatible) — in-app tldraw chat agent default (per AK).
	// Real design work runs through Claude Code sessions; this powers the panel.
	'minimax-m2': {
		name: 'minimax-m2',
		id: 'MiniMax-M2',
		provider: 'minimax',
	},
} as const

export const DEFAULT_MODEL_NAME: AgentModelName = 'minimax-m2'

/**
 * Check if a string is a valid AgentModelName.
 */
export function isValidModelName(value: string | undefined): value is AgentModelName {
	return !!value && value in AGENT_MODEL_DEFINITIONS
}

/**
 * Get the full information about a model from its name.
 * @param modelName - The name of the model.
 * @returns The full definition of the model.
 */
export function getAgentModelDefinition(modelName: AgentModelName): AgentModelDefinition {
	const definition = AGENT_MODEL_DEFINITIONS[modelName]
	if (!definition) {
		throw new Error(`Model ${modelName} not found`)
	}
	return definition
}
