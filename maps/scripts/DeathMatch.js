/**
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: © 2022 Stanislas Daniel Claude Dolcini, Andy Alt
 */

function hasReq(civ, tech) {
    const template = TechnologyTemplates.Get(tech);

    // It's very easy to win against the AI when the game
    // starts with City Phase. Don't activate it.
    if (template.genericName === "City Phase")
        return false;

    // Some civs do not get the same upgrades. Requirements are specified
    // in the templates
    if (!template.requirements?.all) {
        return true;
    }

    let tReq = template.requirements.all;
    let tAny = [];

    if (tReq) {
        if (tReq.some(r => {
            if (r.any)
                tAny = r.any
            if (r.civ)
                return r.civ !== civ;
            return r.notciv === civ;
        })) return false;
        if (tAny) {
            if (tAny.some(r => {
                return r.civ !== civ;
            })) return false;
        }
    }
    return true;
}

{
    const cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
    if (!cmpPlayerManager)
        return;

    // Skip Gaia.
    for (let i = 1; i < cmpPlayerManager.GetNumPlayers(); ++i)
    {
        const cmpTechnologyManager = Engine.QueryInterface(cmpPlayerManager.GetPlayerByID(i), IID_TechnologyManager);
        if (!cmpTechnologyManager)
            continue;

        const civ = QueryPlayerIDInterface(i, IID_Identity).GetCiv();

        let cmpTemplateManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager);
        for (let templateName of cmpTemplateManager.FindAllTemplates(false))
        {
            if (templateName.search("/" + civ + "/") === -1)
                continue;

            let templateRes = cmpTemplateManager.GetTemplateWithoutValidation(templateName).Researcher;
            if (!templateRes)
                continue;

            let technologies = templateRes.Technologies._string.split(" ");
            for (let tech of technologies)
            {
                if (tech.endsWith("{civ}"))
                {
                    tech = tech.replace("{civ}", civ);
                    if (!TechnologyTemplates.Get(tech))
                        tech = tech.replace("_" + civ, "_generic");
                }
                else if (tech.startsWith("pair"))
                {
                    const template = TechnologyTemplates.Get(tech);
                    tech = template.bottom;
                    if (hasReq(civ, template.top))
                        cmpTechnologyManager.ResearchTechnology(template.top);
                }

                if (hasReq(civ, tech))
                    cmpTechnologyManager.ResearchTechnology(tech);
            }
        }
    }
}
