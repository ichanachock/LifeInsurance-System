param(
    [string]$SourceRoot = "C:\SELICProposal2003 _new 2",
    [string]$TargetDataDir = "C:\LifeInsurance-System\mobile-app\data"
)

$ErrorActionPreference = "Stop"

function Write-JsonFile {
    param(
        [string]$Path,
        [object]$Value
    )

    $json = ConvertTo-Json -InputObject $Value -Depth 20
    [System.IO.File]::WriteAllText($Path, $json, [System.Text.UTF8Encoding]::new($false))
}

function Get-PlanIcon {
    param([string]$Category)

    switch ($Category) {
        "life" { "shield-checkmark-outline" }
        "takaful" { "moon-outline" }
        "health" { "medical-outline" }
        "accident" { "bandage-outline" }
        default { "document-text-outline" }
    }
}

function Get-PlanFactor {
    param([string]$Category)

    switch ($Category) {
        "life" { 1.00 }
        "takaful" { 1.05 }
        "health" { 1.25 }
        "accident" { 0.85 }
        default { 1.00 }
    }
}

function Get-Gender {
    param(
        [string]$Code,
        [string]$Description
    )

    if ($Description -match "หญิง") { return "female" }
    if ($Description -match "ชาย") { return "male" }
    if ($Code -match "^F\d{3}") { return "female" }
    if ($Code -match "^M\d{3}") { return "male" }
    if ($Code -match "^F[A-Z]\d{2}") { return "female" }
    if ($Code -match "^M[A-Z]\d{2}") { return "male" }
    if ($Code -match "F\d{2}\s*$") { return "female" }
    if ($Code -match "M\d{2}\s*$") { return "male" }
    if ($Code -match "F\s*$") { return "female" }
    if ($Code -match "M\s*$") { return "male" }
    return $null
}

function Get-IssueAge {
    param(
        [string]$Code,
        [string]$Description
    )

    if ($Description -match "อายุ\s*(\d{1,2})") { return [int]$Matches[1] }
    if ($Code -match "[MF](\d{2})\s*$") { return [int]$Matches[1] }
    return $null
}

function Get-RateGroupKey {
    param([string]$Code)

    $cleanCode = $Code.Trim()
    if ($cleanCode -match "^(.+)[MF]\d{2}$") { return $Matches[1] }
    if ($cleanCode -match "^(.+)[MF]$") { return $Matches[1] }
    return $cleanCode
}

function Get-RatePlanName {
    param(
        [string]$Code,
        [string]$Description
    )

    $name = $Description
    $name = $name -replace "เพศหญิงอายุ\s*\d{1,2}", ""
    $name = $name -replace "เพศชายอายุ\s*\d{1,2}", ""
    $name = $name -replace "หญิงอายุ\s*\d{1,2}", ""
    $name = $name -replace "ชายอายุ\s*\d{1,2}", ""
    $name = $name -replace "อายุ\s*\d{1,2}", ""
    $name = $name.Trim()

    if (-not $name) {
        $name = Get-RateGroupKey -Code $Code
    }

    return $name
}

function Get-ContractType {
    param(
        [string]$GroupKey,
        [string[]]$RiderCodes
    )

    $clean = $GroupKey.Trim()

    if ($RiderCodes -contains $clean) { return "rider" }
    if ($clean -match "^(R|F|M)[A-Z0-9]{2,}") { return "rider" }

    return "main"
}

function Get-RiderCodeFromItem {
    param(
        [string]$ItemCode,
        [string[]]$RiderCodes
    )

    $clean = $ItemCode.Trim()
    foreach ($code in ($RiderCodes | Sort-Object Length -Descending)) {
        if ($clean.StartsWith($code)) {
            return $code
        }
    }

    return $null
}

function Get-RiderClassFromItem {
    param(
        [string]$ItemCode,
        [string]$RiderCode
    )

    if (-not $RiderCode) { return $null }

    $clean = $ItemCode.Trim()
    if ($clean.Length -gt $RiderCode.Length) {
        $next = $clean.Substring($RiderCode.Length, 1)
        if ($next -match "\d") { return $next }
    }

    return $null
}

function Read-RiderRateRows {
    param(
        [object]$Connection,
        [string]$Sql,
        [string]$SourceTable,
        [string]$AmountField,
        [string[]]$RiderCodes
    )

    $rs = New-Object -ComObject ADODB.Recordset
    $rs.Open($Sql, $Connection)

    $rows = New-Object System.Collections.ArrayList
    while (-not $rs.EOF) {
        $itemTable = $rs.Fields.Item("ITEMTABL").Value.ToString().Trim()
        $itemCode = $rs.Fields.Item("ITEMITEM").Value.ToString().Trim()
        $riderCode = Get-RiderCodeFromItem -ItemCode $itemCode -RiderCodes $RiderCodes

        if ($riderCode) {
            $longDesc = ""
            if ($rs.Fields.Item("LONGDESC").Value) {
                $longDesc = $rs.Fields.Item("LONGDESC").Value.ToString().Trim()
            }

            $gender = Get-Gender -Code $itemCode -Description $longDesc
            $amount = [decimal]$rs.Fields.Item($AmountField).Value
            $premiumUnit = [decimal]$rs.Fields.Item("PREM_UNIT").Value
            $sumUnit = [decimal]$rs.Fields.Item("UNIT").Value

            if ($amount -gt 0 -and $premiumUnit -gt 0 -and $sumUnit -gt 0) {
                [void]$rows.Add([pscustomobject][ordered]@{
                    riderCode = $riderCode
                    itemCode = $itemCode
                    table = $itemTable
                    riderClass = Get-RiderClassFromItem -ItemCode $itemCode -RiderCode $riderCode
                    gender = $gender
                    ratePerSumUnit = [math]::Round([double]($amount / $premiumUnit), 6)
                    sumUnit = [double]$sumUnit
                    sourceAmount = [double]$amount
                    premiumUnit = [double]$premiumUnit
                    sourceTable = $SourceTable
                    description = $longDesc
                })
            }
        }

        $rs.MoveNext()
    }

    $rs.Close()
    return $rows
}

function Read-RateRows {
    param(
        [object]$Connection,
        [string]$Sql,
        [string]$SourceTable,
        [string]$AmountField
    )

    $rs = New-Object -ComObject ADODB.Recordset
    $rs.Open($Sql, $Connection)

    $rows = New-Object System.Collections.ArrayList
    while (-not $rs.EOF) {
        $itemTable = $rs.Fields.Item("ITEMTABL").Value.ToString().Trim()
        $itemCode = $rs.Fields.Item("ITEMITEM").Value.ToString().Trim()
        $longDesc = ""
        if ($rs.Fields.Item("LONGDESC").Value) {
            $longDesc = $rs.Fields.Item("LONGDESC").Value.ToString().Trim()
        }

        $gender = Get-Gender -Code $itemCode -Description $longDesc
        $age = Get-IssueAge -Code $itemCode -Description $longDesc
        $amount = [decimal]$rs.Fields.Item($AmountField).Value
        $premiumUnit = [decimal]$rs.Fields.Item("PREM_UNIT").Value
        $sumUnit = [decimal]$rs.Fields.Item("UNIT").Value

        if ($gender -and $null -ne $age -and $amount -gt 0 -and $premiumUnit -gt 0 -and $sumUnit -gt 0) {
            $groupKey = Get-RateGroupKey -Code $itemCode
            $planId = "$itemTable`:$groupKey"
            $ratePerSumUnit = [math]::Round([double]($amount / $premiumUnit), 6)

            [void]$rows.Add([pscustomobject][ordered]@{
                planId = $planId
                table = $itemTable
                groupKey = $groupKey
                itemCode = $itemCode
                planName = Get-RatePlanName -Code $itemCode -Description $longDesc
                gender = $gender
                age = $age
                ratePerSumUnit = $ratePerSumUnit
                sumUnit = [double]$sumUnit
                sourceAmount = [double]$amount
                premiumUnit = [double]$premiumUnit
                sourceTable = $SourceTable
                description = $longDesc
            })
        }

        $rs.MoveNext()
    }

    $rs.Close()
    return $rows
}

New-Item -ItemType Directory -Force -Path $TargetDataDir | Out-Null

$sourceDataDir = Join-Path $SourceRoot "insurance-premium-calculator\data"
$productsPath = Join-Path $sourceDataDir "products.json"
$occupationsPath = Join-Path $sourceDataDir "occupations.json"

if (-not (Test-Path -LiteralPath $productsPath)) {
    throw "ไม่พบไฟล์ products.json ที่ $productsPath"
}

if (-not (Test-Path -LiteralPath $occupationsPath)) {
    throw "ไม่พบไฟล์ occupations.json ที่ $occupationsPath"
}

$products = Get-Content -LiteralPath $productsPath -Raw -Encoding UTF8 | ConvertFrom-Json
$occupations = Get-Content -LiteralPath $occupationsPath -Raw -Encoding UTF8 | ConvertFrom-Json

$plans = @(
    foreach ($product in $products) {
        $displayName = if ($product.thaiName -and $product.thaiName.Trim()) {
            $product.thaiName.Trim()
        } else {
            $product.name
        }

        [ordered]@{
            id = $product.code
            code = $product.code
            name = $displayName
            englishName = $product.name
            description = $product.desc
            category = $product.category
            policyTerm = $product.policyTerm
            paymentTerm = $product.paymentTerm
            ipdRoom = $product.ipdRoom
            opdLimit = $product.opdLimit
            icon = Get-PlanIcon -Category $product.category
            factor = Get-PlanFactor -Category $product.category
        }
    }
)

Write-JsonFile -Path (Join-Path $TargetDataDir "plans.json") -Value $plans
Write-JsonFile -Path (Join-Path $TargetDataDir "selicProducts.json") -Value $products
Write-JsonFile -Path (Join-Path $TargetDataDir "occupations.json") -Value $occupations

$mdbPath = Join-Path $SourceRoot "SeicAgt.mdb"
if (Test-Path -LiteralPath $mdbPath) {
    try {
        $conn = New-Object -ComObject ADODB.Connection
        $conn.Open("Provider=Microsoft.ACE.OLEDB.16.0;Data Source=$mdbPath;Jet OLEDB:Database Password=selicdatabasex")

        $exports = @(
            @{
                Name = "selicPlanOrder.json"
                Sql = "SELECT plan_code, plan_desc, plan_order_no FROM PLAN_ORDER ORDER BY plan_order_no, plan_code"
            },
            @{
                Name = "selicPlanExt.json"
                Sql = "SELECT ITEMITEM, plan_type_desc, nb_allow_flag FROM PLAN_EXT ORDER BY ITEMITEM"
            },
            @{
                Name = "selicPremiumRatesSample.json"
                Sql = "SELECT TOP 1000 ITEMITEM, ITEMPFX, ITEMTABL, ITMFRM, ITMTO, PREM_UNIT, UNIT, TRATEX, VALIDFLAG FROM IT04PF ORDER BY ITEMTABL, ITEMITEM"
            }
        )

        foreach ($export in $exports) {
            $rs = New-Object -ComObject ADODB.Recordset
            $rs.Open($export.Sql, $conn)

            $rows = @()
            while (-not $rs.EOF) {
                $row = [ordered]@{}
                for ($i = 0; $i -lt $rs.Fields.Count; $i++) {
                    $field = $rs.Fields.Item($i)
                    $row[$field.Name] = $field.Value
                }
                $rows += $row
                $rs.MoveNext()
            }
            $rs.Close()

            Write-JsonFile -Path (Join-Path $TargetDataDir $export.Name) -Value $rows
        }

        $mainContracts = @()
        $rs = New-Object -ComObject ADODB.Recordset
        $rs.Open("SELECT ITEMITEM, plan_type_desc, nb_allow_flag FROM PLAN_EXT ORDER BY ITEMITEM", $conn)
        while (-not $rs.EOF) {
            $code = $rs.Fields.Item("ITEMITEM").Value.ToString().Trim()
            $desc = $rs.Fields.Item("plan_type_desc").Value.ToString().Trim()
            $allowFlag = $rs.Fields.Item("nb_allow_flag").Value
            $mainContracts += [pscustomobject][ordered]@{
                id = $code
                code = $code
                name = $desc
                contractType = "main"
                sourceTable = "PLAN_EXT"
                newBusinessAllowed = $allowFlag -eq "Y"
            }
            $rs.MoveNext()
        }
        $rs.Close()

        $riderContracts = @()
        $rs = New-Object -ComObject ADODB.Recordset
        $rs.Open("SELECT RIDER_CODE, RIDER_DESC, RIDER_GROUP, RIDER_ORDER_NO FROM RIDER_EXT ORDER BY RIDER_ORDER_NO, RIDER_CODE", $conn)
        while (-not $rs.EOF) {
            $code = $rs.Fields.Item("RIDER_CODE").Value.ToString().Trim()
            $desc = $rs.Fields.Item("RIDER_DESC").Value.ToString().Trim()
            $group = $rs.Fields.Item("RIDER_GROUP").Value
            $order = $rs.Fields.Item("RIDER_ORDER_NO").Value
            $riderContracts += [pscustomobject][ordered]@{
                id = $code
                code = $code
                name = $desc
                contractType = "rider"
                riderGroup = if ($group) { $group.ToString().Trim() } else { $null }
                orderNo = $order
                sourceTable = "RIDER_EXT"
            }
            $rs.MoveNext()
        }
        $rs.Close()

        $riderCodes = @(
            $riderContracts | Select-Object -ExpandProperty code
        )

        $rs = New-Object -ComObject ADODB.Recordset
        $rs.Open("SELECT ITEMITEM, LONGDESC, VALIDFLAG FROM RIDER_EXT_STATUS WHERE VALIDFLAG = '1' ORDER BY ITEMITEM", $conn)
        while (-not $rs.EOF) {
            $code = $rs.Fields.Item("ITEMITEM").Value.ToString().Trim()
            if ($riderCodes -notcontains $code) {
                $desc = $rs.Fields.Item("LONGDESC").Value
                $riderContracts += [pscustomobject][ordered]@{
                    id = $code
                    code = $code
                    name = if ($desc) { $desc.ToString().Trim() } else { $code }
                    contractType = "rider"
                    riderGroup = $null
                    orderNo = $null
                    sourceTable = "RIDER_EXT_STATUS"
                }
                $riderCodes += $code
            }
            $rs.MoveNext()
        }
        $rs.Close()

        Write-JsonFile -Path (Join-Path $TargetDataDir "mainContracts.json") -Value $mainContracts
        Write-JsonFile -Path (Join-Path $TargetDataDir "riderContracts.json") -Value $riderContracts

        $decodedRiderRateRows = New-Object System.Collections.ArrayList

        $riderT5664Rows = Read-RiderRateRows `
            -Connection $conn `
            -SourceTable "ITEMPF_T5664" `
            -AmountField "INSTPR" `
            -RiderCodes $riderCodes `
            -Sql "SELECT r.ITEMITEM, r.ITEMTABL, r.INSTPR, r.PREM_UNIT, r.UNIT, d.LONGDESC FROM ITEMPf_T5664 r LEFT JOIN DESCPF d ON d.DESCTABL = r.ITEMTABL AND d.DESCITEM = r.ITEMITEM WHERE r.INSTPR > 0 AND r.VALIDFLAG = '1'"
        foreach ($row in $riderT5664Rows) { [void]$decodedRiderRateRows.Add($row) }

        $riderTt506Rows = Read-RiderRateRows `
            -Connection $conn `
            -SourceTable "ITEMPF_TT506" `
            -AmountField "INSTPR" `
            -RiderCodes $riderCodes `
            -Sql "SELECT r.ITEMITEM, r.ITEMTABL, r.INSTPR, r.PREM_UNIT, r.UNIT, d.LONGDESC FROM ITEMPf_TT506 r LEFT JOIN DESCPF d ON d.DESCTABL = r.ITEMTABL AND d.DESCITEM = r.ITEMITEM WHERE r.INSTPR > 0 AND r.VALIDFLAG = '1'"
        foreach ($row in $riderTt506Rows) { [void]$decodedRiderRateRows.Add($row) }

        $riderIt04Rows = Read-RiderRateRows `
            -Connection $conn `
            -SourceTable "IT04PF" `
            -AmountField "TRATEX" `
            -RiderCodes $riderCodes `
            -Sql "SELECT r.ITEMITEM, r.ITEMTABL, r.TRATEX, r.PREM_UNIT, r.UNIT, d.LONGDESC FROM IT04PF r LEFT JOIN DESCPF d ON d.DESCTABL = r.ITEMTABL AND d.DESCITEM = r.ITEMITEM WHERE r.TRATEX > 0 AND r.VALIDFLAG = '1'"
        foreach ($row in $riderIt04Rows) { [void]$decodedRiderRateRows.Add($row) }

        $decodedRiderRateRows = @(
            $decodedRiderRateRows |
                Sort-Object riderCode, riderClass, gender, itemCode, sourceTable -Unique
        )

        Write-JsonFile -Path (Join-Path $TargetDataDir "riderPremiumRates.json") -Value $decodedRiderRateRows

        $decodedRateRows = New-Object System.Collections.ArrayList

        $it04Rows = Read-RateRows `
            -Connection $conn `
            -SourceTable "IT04PF" `
            -AmountField "TRATEX" `
            -Sql "SELECT r.ITEMITEM, r.ITEMTABL, r.TRATEX, r.PREM_UNIT, r.UNIT, d.LONGDESC FROM IT04PF r LEFT JOIN DESCPF d ON d.DESCTABL = r.ITEMTABL AND d.DESCITEM = r.ITEMITEM WHERE r.TRATEX > 0 AND r.VALIDFLAG = '1'"
        foreach ($row in $it04Rows) { [void]$decodedRateRows.Add($row) }

        $tt506Rows = Read-RateRows `
            -Connection $conn `
            -SourceTable "ITEMPF_TT506" `
            -AmountField "INSTPR" `
            -Sql "SELECT r.ITEMITEM, r.ITEMTABL, r.INSTPR, r.PREM_UNIT, r.UNIT, d.LONGDESC FROM ITEMPf_TT506 r LEFT JOIN DESCPF d ON d.DESCTABL = r.ITEMTABL AND d.DESCITEM = r.ITEMITEM WHERE r.INSTPR > 0 AND r.VALIDFLAG = '1'"
        foreach ($row in $tt506Rows) { [void]$decodedRateRows.Add($row) }

        $t5664Rows = Read-RateRows `
            -Connection $conn `
            -SourceTable "ITEMPF_T5664" `
            -AmountField "INSTPR" `
            -Sql "SELECT r.ITEMITEM, r.ITEMTABL, r.INSTPR, r.PREM_UNIT, r.UNIT, d.LONGDESC FROM ITEMPf_T5664 r LEFT JOIN DESCPF d ON d.DESCTABL = r.ITEMTABL AND d.DESCITEM = r.ITEMITEM WHERE r.INSTPR > 0 AND r.VALIDFLAG = '1'"
        foreach ($row in $t5664Rows) { [void]$decodedRateRows.Add($row) }

        $realPlans = @(
            $decodedRateRows |
                Group-Object -Property planId |
                ForEach-Object {
                    $first = $_.Group[0]
                    $ages = $_.Group | Select-Object -ExpandProperty age
                    $genders = $_.Group | Select-Object -ExpandProperty gender -Unique
                    $stableName = "$($first.table) / $($first.groupKey)"
                    $contractType = Get-ContractType -GroupKey $first.groupKey -RiderCodes $riderCodes
                    [pscustomobject][ordered]@{
                        id = $first.planId
                        code = $first.table
                        name = $stableName
                        englishName = $stableName
                        description = "นำเข้าจาก $($first.sourceTable): $($first.description)"
                        contractType = $contractType
                        category = "real-rate"
                        policyTerm = $null
                        paymentTerm = $null
                        ipdRoom = $null
                        opdLimit = $null
                        icon = "calculator-outline"
                        factor = 1
                        rateSource = $first.sourceTable
                        rateRows = $_.Count
                        minAge = ($ages | Measure-Object -Minimum).Minimum
                        maxAge = ($ages | Measure-Object -Maximum).Maximum
                        genders = @($genders)
                    }
                } |
                Sort-Object code, name
        )

        if ($realPlans.Count -gt 0) {
            Write-JsonFile -Path (Join-Path $TargetDataDir "realPremiumRates.json") -Value $decodedRateRows
            Write-JsonFile -Path (Join-Path $TargetDataDir "plans.json") -Value $realPlans
            Write-JsonFile -Path (Join-Path $TargetDataDir "selicImportedProductsAsPlans.json") -Value $plans
            $plans = $realPlans
        }

        $conn.Close()
    } catch {
        Write-Warning "อ่าน SeicAgt.mdb ไม่สำเร็จ: $_"
        if ($conn -and $conn.State -eq 1) {
            $conn.Close()
        }
    }
}

Write-Output "Imported $($plans.Count) plans and $($occupations.Count) occupations into $TargetDataDir"
