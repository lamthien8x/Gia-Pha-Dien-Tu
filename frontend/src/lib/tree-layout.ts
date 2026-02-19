/**
 * Anchor-Based Tree Layout — straight vertical lines
 *
 * Each subtree tracks an `anchorX` — the patrilineal person's center X.
 * Children are centered beneath this anchor, guaranteeing straight
 * vertical parent-child lines for single-child families.
 * Multi-child families use a minimal horizontal bus line.
 */

export interface TreeNode {
    handle: string;
    displayName: string;
    gender: number;
    birthYear?: number;
    deathYear?: number;
    isLiving: boolean;
    isPrivacyFiltered: boolean;
    isPatrilineal: boolean;
    families: string[];
    parentFamilies: string[];
}

export interface TreeFamily {
    handle: string;
    fatherHandle?: string;
    motherHandle?: string;
    children: string[];
}

export interface PositionedNode {
    node: TreeNode;
    x: number;
    y: number;
    generation: number;
}

export interface PositionedCouple {
    familyHandle: string;
    fatherPos?: PositionedNode;
    motherPos?: PositionedNode;
    midX: number;
    y: number;
}

export interface Connection {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    type: 'parent-child' | 'couple';
}

export interface LayoutResult {
    nodes: PositionedNode[];
    couples: PositionedCouple[];
    connections: Connection[];
    width: number;
    height: number;
    generations: number;
}

// Sizing
export const CARD_W = 180;
export const CARD_H = 80;
export const H_SPACE = 30;
export const V_SPACE = 80;
export const COUPLE_GAP = 8;

// ═══ Internal tree structure ═══

interface FamilySubtree {
    family: TreeFamily;
    father?: TreeNode;
    mother?: TreeNode;
    patrilineal?: TreeNode;     // the Lê person
    spouse?: TreeNode;          // the non-Lê person
    childSubtrees: FamilySubtree[];
    singleChildren: TreeNode[];
    width: number;              // total pixel width
    anchorX: number;            // patrilineal center X from left edge
}

// ═══ Step 1: Build subtree + compute widths bottom-up ═══

function buildSubtree(
    family: TreeFamily,
    personMap: Map<string, TreeNode>,
    familyMap: Map<string, TreeFamily>,
    visited: Set<string>,
): FamilySubtree | null {
    if (visited.has(family.handle)) return null;
    visited.add(family.handle);

    const father = family.fatherHandle ? personMap.get(family.fatherHandle) : undefined;
    const mother = family.motherHandle ? personMap.get(family.motherHandle) : undefined;

    // Determine who is patrilineal (Lê) — they get the anchor position
    const patrilineal = father?.isPatrilineal ? father : mother?.isPatrilineal ? mother : (father || mother);
    const spouse = patrilineal === father ? mother : father;

    const childSubtrees: FamilySubtree[] = [];
    const singleChildren: TreeNode[] = [];

    for (const childHandle of family.children) {
        const child = personMap.get(childHandle);
        if (!child) continue;

        const childFamily = Array.from(familyMap.values()).find(f =>
            !visited.has(f.handle) &&
            (f.fatherHandle === childHandle || f.motherHandle === childHandle)
        );

        if (childFamily) {
            const sub = buildSubtree(childFamily, personMap, familyMap, visited);
            if (sub) childSubtrees.push(sub);
        } else {
            singleChildren.push(child);
        }
    }

    // ── Compute width and anchorX using actual anchor positions ──

    const hasCouple = patrilineal && spouse;
    const halfCard = CARD_W / 2;
    const coupleRightExtent = hasCouple
        ? halfCard + COUPLE_GAP + CARD_W
        : halfCard;

    // Build child items with anchors (same structure as assignPositions)
    const childAnchors: { width: number; anchorOffset: number }[] = [];
    for (const cs of childSubtrees) {
        childAnchors.push({ width: cs.width, anchorOffset: cs.anchorX });
    }
    for (const _sc of singleChildren) {
        childAnchors.push({ width: CARD_W, anchorOffset: halfCard });
    }

    let anchorX: number;
    let width: number;

    if (childAnchors.length === 0) {
        // No children: just the couple
        anchorX = halfCard;
        width = hasCouple ? 2 * CARD_W + COUPLE_GAP : CARD_W;
    } else if (childAnchors.length === 1) {
        // Single child: anchor aligns directly
        const child = childAnchors[0];
        // Left extent: max of (patri card left) and (child left)
        const leftFromAnchor = Math.max(halfCard, child.anchorOffset);
        // Right extent: max of (couple right) and (child right)
        const rightFromAnchor = Math.max(coupleRightExtent, child.width - child.anchorOffset);
        anchorX = leftFromAnchor;
        width = leftFromAnchor + rightFromAnchor;
    } else {
        // Multiple children: compute exact anchor positions within block
        const anchorPositions: number[] = [];
        let offset = 0;
        for (const item of childAnchors) {
            anchorPositions.push(offset + item.anchorOffset);
            offset += item.width + H_SPACE;
        }
        const totalChildWidth = offset - H_SPACE;
        const firstAnchor = anchorPositions[0];
        const lastAnchor = anchorPositions[anchorPositions.length - 1];
        const anchorsMidpoint = (firstAnchor + lastAnchor) / 2;

        // Left extent: max of (patri card left) and (children left from midpoint)
        const leftFromAnchor = Math.max(halfCard, anchorsMidpoint);
        // Right extent: max of (couple right) and (children right from midpoint)
        const rightFromAnchor = Math.max(coupleRightExtent, totalChildWidth - anchorsMidpoint);
        anchorX = leftFromAnchor;
        width = leftFromAnchor + rightFromAnchor;
    }

    return {
        family, father, mother, patrilineal, spouse,
        childSubtrees, singleChildren,
        width, anchorX,
    };
}

// ═══ Step 2: Assign positions top-down ═══

function assignPositions(
    subtree: FamilySubtree,
    startX: number,
    generation: number,
    allNodes: PositionedNode[],
    placed: Set<string>,
) {
    const { patrilineal, spouse, childSubtrees, singleChildren, anchorX } = subtree;
    const y = generation * (CARD_H + V_SPACE);
    const patriCenterX = startX + anchorX;  // absolute X of patrilineal person's center

    // ── Place patrilineal person (LEFT position) ──
    if (patrilineal && !placed.has(patrilineal.handle)) {
        allNodes.push({ node: patrilineal, x: patriCenterX - CARD_W / 2, y, generation });
        placed.add(patrilineal.handle);
    }

    // ── Place spouse (RIGHT of patrilineal) ──
    if (spouse && !placed.has(spouse.handle)) {
        allNodes.push({ node: spouse, x: patriCenterX + CARD_W / 2 + COUPLE_GAP, y, generation });
        placed.add(spouse.handle);
    }

    // ── Place children — aligned under patriCenterX by anchor ──
    let childBlockWidth = 0;
    const childItems: { subtree?: FamilySubtree; single?: TreeNode; width: number; anchorOffset: number }[] = [];
    for (const cs of childSubtrees) {
        childItems.push({ subtree: cs, width: cs.width, anchorOffset: cs.anchorX });
        childBlockWidth += cs.width;
    }
    for (const sc of singleChildren) {
        childItems.push({ single: sc, width: CARD_W, anchorOffset: CARD_W / 2 });
        childBlockWidth += CARD_W;
    }
    // Add gaps between items
    if (childItems.length > 1) {
        childBlockWidth += (childItems.length - 1) * H_SPACE;
    }

    // Compute the anchor position of each child relative to the children block start
    // Then align so that the midpoint of first and last child anchors = patriCenterX
    if (childItems.length === 1) {
        // Single child: align child anchor directly under parent anchor
        const item = childItems[0];
        const cx = patriCenterX - item.anchorOffset;
        if (item.subtree) {
            assignPositions(item.subtree, cx, generation + 1, allNodes, placed);
        } else if (item.single && !placed.has(item.single.handle)) {
            const childY = (generation + 1) * (CARD_H + V_SPACE);
            allNodes.push({ node: item.single, x: cx, y: childY, generation: generation + 1 });
            placed.add(item.single.handle);
        }
    } else if (childItems.length > 1) {
        // Multiple children: compute positions so anchors are centered under parent
        // First, compute relative anchor positions within the block
        const anchorPositions: number[] = [];
        let offset = 0;
        for (const item of childItems) {
            anchorPositions.push(offset + item.anchorOffset);
            offset += item.width + H_SPACE;
        }
        const firstAnchor = anchorPositions[0];
        const lastAnchor = anchorPositions[anchorPositions.length - 1];
        const anchorsMidpoint = (firstAnchor + lastAnchor) / 2;

        // Shift block so that anchorsMidpoint = patriCenterX
        const blockStartX = patriCenterX - anchorsMidpoint;

        let cx = blockStartX;
        for (const item of childItems) {
            if (item.subtree) {
                assignPositions(item.subtree, cx, generation + 1, allNodes, placed);
            } else if (item.single && !placed.has(item.single.handle)) {
                const childY = (generation + 1) * (CARD_H + V_SPACE);
                allNodes.push({ node: item.single, x: cx, y: childY, generation: generation + 1 });
                placed.add(item.single.handle);
            }
            cx += item.width + H_SPACE;
        }
    }
}

// ═══ Main layout function ═══

export function computeLayout(people: TreeNode[], families: TreeFamily[]): LayoutResult {
    const personMap = new Map(people.map(p => [p.handle, p]));
    const familyMap = new Map(families.map(f => [f.handle, f]));

    const gens = assignGenerations(people, families);

    // Find root families (parents not children of any family)
    const childOfAnyFamily = new Set<string>();
    for (const f of families) {
        for (const ch of f.children) childOfAnyFamily.add(ch);
    }
    const rootFamilies = families.filter(f => {
        const fh = f.fatherHandle ? personMap.get(f.fatherHandle) : null;
        const mh = f.motherHandle ? personMap.get(f.motherHandle) : null;
        return (fh && !childOfAnyFamily.has(fh.handle)) || (mh && !childOfAnyFamily.has(mh.handle));
    });

    const allNodes: PositionedNode[] = [];
    const visited = new Set<string>();
    const placed = new Set<string>();
    let cursorX = 0;

    for (const fam of rootFamilies) {
        const subtree = buildSubtree(fam, personMap, familyMap, visited);
        if (!subtree) continue;
        assignPositions(subtree, cursorX, 0, allNodes, placed);
        cursorX += subtree.width + H_SPACE * 2;
    }

    // Place orphans
    for (const p of people) {
        if (!placed.has(p.handle)) {
            const gen = gens.get(p.handle) ?? 0;
            allNodes.push({
                node: p,
                x: cursorX,
                y: gen * (CARD_H + V_SPACE),
                generation: gen,
            });
            placed.add(p.handle);
            cursorX += CARD_W + H_SPACE;
        }
    }

    // ═══ Compute connections from actual placed positions ═══
    const nodeMap = new Map(allNodes.map(n => [n.node.handle, n]));
    const connections: Connection[] = [];
    const couples: PositionedCouple[] = [];

    for (const fam of families) {
        const fatherNode = fam.fatherHandle ? nodeMap.get(fam.fatherHandle) : undefined;
        const motherNode = fam.motherHandle ? nodeMap.get(fam.motherHandle) : undefined;
        if (!fatherNode && !motherNode) continue;

        const patriNode = (fatherNode?.node.isPatrilineal ? fatherNode : motherNode) ?? fatherNode;

        // Couple line
        if (fatherNode && motherNode) {
            const left = fatherNode.x < motherNode.x ? fatherNode : motherNode;
            const right = fatherNode.x < motherNode.x ? motherNode : fatherNode;
            connections.push({
                fromX: left.x + CARD_W, fromY: left.y + CARD_H / 2,
                toX: right.x, toY: right.y + CARD_H / 2,
                type: 'couple',
            });
            couples.push({
                familyHandle: fam.handle,
                fatherPos: fatherNode, motherPos: motherNode,
                midX: (left.x + CARD_W + right.x) / 2,
                y: left.y,
            });
        }

        // Parent-child connections: bus-line routing
        if (patriNode && fam.children.length > 0) {
            const parentCX = patriNode.x + CARD_W / 2;
            const parentBottomY = patriNode.y + CARD_H;

            const placedChildren = fam.children
                .map(ch => nodeMap.get(ch))
                .filter((n): n is PositionedNode => !!n);
            if (placedChildren.length === 0) continue;

            const childTopY = placedChildren[0].y;
            const busY = parentBottomY + (childTopY - parentBottomY) / 2;

            // Vertical stub from parent to bus
            connections.push({
                fromX: parentCX, fromY: parentBottomY,
                toX: parentCX, toY: busY,
                type: 'parent-child',
            });

            if (placedChildren.length === 1) {
                const childCX = placedChildren[0].x + CARD_W / 2;
                // Horizontal segment only if child isn't directly below
                if (Math.abs(childCX - parentCX) > 1) {
                    connections.push({
                        fromX: parentCX, fromY: busY,
                        toX: childCX, toY: busY,
                        type: 'parent-child',
                    });
                }
                connections.push({
                    fromX: childCX, fromY: busY,
                    toX: childCX, toY: childTopY,
                    type: 'parent-child',
                });
            } else {
                // Multiple children: horizontal bus + vertical drops
                const childCenters = placedChildren.map(c => c.x + CARD_W / 2).sort((a, b) => a - b);
                const busLeft = Math.min(parentCX, childCenters[0]);
                const busRight = Math.max(parentCX, childCenters[childCenters.length - 1]);

                connections.push({
                    fromX: busLeft, fromY: busY,
                    toX: busRight, toY: busY,
                    type: 'parent-child',
                });

                for (const child of placedChildren) {
                    const cx = child.x + CARD_W / 2;
                    connections.push({
                        fromX: cx, fromY: busY,
                        toX: cx, toY: childTopY,
                        type: 'parent-child',
                    });
                }
            }
        }
    }

    // Bounds
    let maxX = 0, maxY = 0;
    for (const n of allNodes) {
        maxX = Math.max(maxX, n.x + CARD_W);
        maxY = Math.max(maxY, n.y + CARD_H);
    }

    return {
        nodes: allNodes,
        couples,
        connections,
        width: maxX + H_SPACE,
        height: maxY + V_SPACE / 2,
        generations: Math.max(...Array.from(gens.values())) + 1,
    };
}

// ═══ Generation assignment ═══

function assignGenerations(people: TreeNode[], families: TreeFamily[]): Map<string, number> {
    const gens = new Map<string, number>();
    const familyMap = new Map(families.map(f => [f.handle, f]));

    function setGen(handle: string, gen: number) {
        const current = gens.get(handle);
        if (current !== undefined && current <= gen) return;
        gens.set(handle, gen);
        const person = people.find(p => p.handle === handle);
        if (!person) return;
        for (const famId of person.families) {
            const fam = familyMap.get(famId);
            if (!fam) continue;
            if (fam.fatherHandle && fam.fatherHandle !== handle) setGen(fam.fatherHandle, gen);
            if (fam.motherHandle && fam.motherHandle !== handle) setGen(fam.motherHandle, gen);
            for (const ch of fam.children) setGen(ch, gen + 1);
        }
    }

    for (const p of people) {
        if (p.parentFamilies.length === 0 && !gens.has(p.handle)) {
            setGen(p.handle, 0);
        }
    }
    for (const p of people) {
        if (!gens.has(p.handle)) setGen(p.handle, 0);
    }

    return gens;
}

// ═══ Filter functions ═══

export function filterAncestors(handle: string, people: TreeNode[], families: TreeFamily[]) {
    const result = new Set<string>();
    const familyMap = new Map(families.map(f => [f.handle, f]));
    const personMap = new Map(people.map(p => [p.handle, p]));

    function walk(h: string) {
        if (result.has(h)) return;
        result.add(h);
        const person = personMap.get(h);
        if (!person) return;
        for (const pfId of person.parentFamilies) {
            const fam = familyMap.get(pfId);
            if (fam) {
                if (fam.fatherHandle) walk(fam.fatherHandle);
                if (fam.motherHandle) walk(fam.motherHandle);
            }
        }
    }
    walk(handle);

    return {
        filteredPeople: people.filter(p => result.has(p.handle)),
        filteredFamilies: families.filter(f =>
            (f.fatherHandle && result.has(f.fatherHandle)) || (f.motherHandle && result.has(f.motherHandle))
        ),
    };
}

export function filterDescendants(handle: string, people: TreeNode[], families: TreeFamily[]) {
    const result = new Set<string>();
    const familyMap = new Map(families.map(f => [f.handle, f]));
    const personMap = new Map(people.map(p => [p.handle, p]));

    function walk(h: string) {
        if (result.has(h)) return;
        result.add(h);
        const person = personMap.get(h);
        if (!person) return;
        for (const fId of person.families) {
            const fam = familyMap.get(fId);
            if (fam) {
                if (fam.fatherHandle) result.add(fam.fatherHandle);
                if (fam.motherHandle) result.add(fam.motherHandle);
                for (const ch of fam.children) walk(ch);
            }
        }
    }
    walk(handle);

    return {
        filteredPeople: people.filter(p => result.has(p.handle)),
        filteredFamilies: families.filter(f =>
            f.children.some(ch => result.has(ch))
        ),
    };
}
