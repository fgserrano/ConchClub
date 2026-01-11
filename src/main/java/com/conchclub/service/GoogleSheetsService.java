package com.conchclub.service;

import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleSheetsService {

    private final Sheets sheets;

    @Value("${google.sheet.id}")
    private String spreadsheetId;

    public List<List<Object>> readRange(String range) {
        try {
            ValueRange response = sheets.spreadsheets().values()
                    .get(spreadsheetId, range)
                    .execute();
            List<List<Object>> values = response.getValues();
            return values == null ? Collections.emptyList() : values;
        } catch (IOException e) {
            log.error("Error reading from Google Sheet: {}", e.getMessage());
            throw new RuntimeException("Failed to read from Google Sheet", e);
        }
    }

    public void writeRow(String range, List<Object> rowData) {
        try {
            ValueRange body = new ValueRange().setValues(Collections.singletonList(rowData));
            sheets.spreadsheets().values()
                    .append(spreadsheetId, range, body)
                    .setValueInputOption("USER_ENTERED")
                    .execute();
        } catch (IOException e) {
            log.error("Error writing to Google Sheet: {}", e.getMessage());
            throw new RuntimeException("Failed to write to Google Sheet", e);
        }
    }

    public void updateCell(String range, Object value) {
        try {
            ValueRange body = new ValueRange().setValues(Collections.singletonList(Collections.singletonList(value)));
            sheets.spreadsheets().values()
                    .update(spreadsheetId, range, body)
                    .setValueInputOption("USER_ENTERED")
                    .execute();
        } catch (IOException e) {
            log.error("Error updating Google Sheet cell: {}", e.getMessage());
            throw new RuntimeException("Failed to update Google Sheet", e);
        }
    }
}
