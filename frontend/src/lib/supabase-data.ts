/**
 * Supabase data layer for the genealogy tree
 * Replaces localStorage-based persistence with Supabase PostgreSQL
 */
import { supabase } from './supabase';
import type { TreeNode, TreeFamily } from './tree-layout';

export type { TreeNode, TreeFamily };

// ── Convert snake_case DB rows to camelCase ──

function dbRowToTreeNode(row: Record<string, unknown>): TreeNode {
    return {
        handle: row.handle as string,
        displayName: row.display_name as string,
        gender: row.gender as number,
        birthYear: row.birth_year as number | undefined,
        deathYear: row.death_year as number | undefined,
        generation: row.generation as number,
        isLiving: row.is_living as boolean,
        isPrivacyFiltered: row.is_privacy_filtered as boolean,
        isPatrilineal: row.is_patrilineal as boolean,
        families: (row.families as string[]) || [],
        parentFamilies: (row.parent_families as string[]) || [],
    };
}

function dbRowToTreeFamily(row: Record<string, unknown>): TreeFamily {
    return {
        handle: row.handle as string,
        fatherHandle: row.father_handle as string | undefined,
        motherHandle: row.mother_handle as string | undefined,
        children: (row.children as string[]) || [],
    };
}

// ── Read operations ──

/** Fetch all people from Supabase */
export async function fetchPeople(): Promise<TreeNode[]> {
    const { data, error } = await supabase
        .from('people')
        .select('handle, display_name, gender, birth_year, death_year, generation, is_living, is_privacy_filtered, is_patrilineal, families, parent_families')
        .order('generation')
        .order('handle');

    if (error) {
        console.error('Failed to fetch people:', error.message);
        return [];
    }
    return (data || []).map(dbRowToTreeNode);
}

/** Fetch all families from Supabase */
export async function fetchFamilies(): Promise<TreeFamily[]> {
    const { data, error } = await supabase
        .from('families')
        .select('handle, father_handle, mother_handle, children')
        .order('handle');

    if (error) {
        console.error('Failed to fetch families:', error.message);
        return [];
    }
    return (data || []).map(dbRowToTreeFamily);
}

/** Fetch both people and families in parallel */
export async function fetchTreeData(): Promise<{ people: TreeNode[]; families: TreeFamily[] }> {
    const [people, families] = await Promise.all([fetchPeople(), fetchFamilies()]);
    return { people, families };
}

// ── Write operations (editor mode) ──

/** Update children order for a family */
export async function updateFamilyChildren(
    familyHandle: string,
    newChildrenOrder: string[]
): Promise<void> {
    const { error } = await supabase
        .from('families')
        .update({ children: newChildrenOrder })
        .eq('handle', familyHandle);

    if (error) console.error('Failed to update family children:', error.message);
}

/** Move a child from one family to another */
export async function moveChildToFamily(
    childHandle: string,
    fromFamilyHandle: string,
    toFamilyHandle: string,
    currentFamilies: TreeFamily[]
): Promise<void> {
    const fromFam = currentFamilies.find(f => f.handle === fromFamilyHandle);
    const toFam = currentFamilies.find(f => f.handle === toFamilyHandle);

    const updates: Promise<void>[] = [];

    if (fromFam) {
        updates.push(
            updateFamilyChildren(fromFamilyHandle, fromFam.children.filter(ch => ch !== childHandle))
        );
    }
    if (toFam) {
        updates.push(
            updateFamilyChildren(toFamilyHandle, [...toFam.children.filter(ch => ch !== childHandle), childHandle])
        );
    }

    await Promise.all(updates);
}

/** Remove a child from a family */
export async function removeChildFromFamily(
    childHandle: string,
    familyHandle: string,
    currentFamilies: TreeFamily[]
): Promise<void> {
    const fam = currentFamilies.find(f => f.handle === familyHandle);
    if (fam) {
        await updateFamilyChildren(familyHandle, fam.children.filter(ch => ch !== childHandle));
    }
}

/** Update a person's isLiving status */
export async function updatePersonLiving(
    handle: string,
    isLiving: boolean
): Promise<void> {
    const { error } = await supabase
        .from('people')
        .update({ is_living: isLiving })
        .eq('handle', handle);

    if (error) console.error('Failed to update person living status:', error.message);
}
