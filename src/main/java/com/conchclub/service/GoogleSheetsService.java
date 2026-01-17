package com.conchclub.service;

import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoogleSheetsService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleSheetsService.class);

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
            logger.error("Error reading from Google Sheet: {}", e.getMessage());
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
            logger.error("Error writing to Google Sheet: {}", e.getMessage());
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
            logger.error("Error updating Google Sheet cell: {}", e.getMessage());
            throw new RuntimeException("Failed to update Google Sheet", e);
        }
    }
}
